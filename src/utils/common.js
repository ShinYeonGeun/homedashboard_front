import { useRouter } from 'vue-router';
import { useSnackbar } from '@/utils/useSnackbar';
import { useLoading } from '@/utils/useLoading';
import { useModal } from '@/utils/useModal';
import { defineAsyncComponent } from 'vue'

export const rulesReq = (value) => !!value || '필수 입력항목입니다.';

export const send = async (uri, option, data, sccessFunc, errorFunc) => {

	const token = sessionStorage.getItem('Access-Token');

	//패치 기본 옵션
	const defOps = {
		method: 'POST'
		, headers: {
			'Content-Type': 'application/json'
			, 'Authorization': `Bearer ${token}`
		}
		, body: JSON.stringify(data)
	};

	// 입력받은 옵션이 있으면 merge
	Object.assign(defOps, option);

	try {
		//Fetch call
		const response = await fetch(`http://127.0.0.1:8080${uri}`, defOps)
			.then((response) => response)

		const headers = response.headers;
		const res = await response.json();

		//정상응답 받았으면 처리
		if (response.ok) {
			const token = headers.get('Access-Token');
			if (token) {
				sessionStorage.setItem('Access-Token', token);
			}

			if (res.resultCd === 'S' && sccessFunc) {
				sccessFunc(data, res);
			} else if (res.resultCd === 'E' && errorFunc) {
				errorFunc(data, res);
			}

		} else {
			console.error(res);

			if (res.status) {
				if (res.status == 401) {
					//window.location.href = '/login';
					//loadContent(document.getElementById('wrapper'), '/cmn/usr/Login');
				}
			}
		}
	} catch (error) {
		console.error(error);
	}
}

export const sendByURIWithOption = async (uri, option, data, sccessFunc, errorFunc) => {
	await send(uri, option, data, sccessFunc, errorFunc);
};

export const sendByURI = async (uri, data, sccessFunc, errorFunc) => {
	await send(uri, {}, data, sccessFunc, errorFunc);
};

export const sendByTrnCd = async (trnCd, data, sccessFunc, errorFunc) => {
	const token = sessionStorage.getItem('Access-Token');
	const ops = {
		method: 'POST'
		, headers: {
			'Content-Type': 'application/json'
			, 'Authorization': `Bearer ${token}`
			, 'TrnCd': trnCd
		}
		, body: JSON.stringify(data)
	};
	await send('/callService', ops, data, sccessFunc, errorFunc);
}
export const isEmpty = (o) => {

	let t = typeof o;

	if (o === null || o === undefined) {
		return true;
	}

	t = t.toLowerCase();

	if (t === 'string') {
		return 0 === o.trim().length;
	} else if (t === 'number') {
		return 0 === o.toString().trim().length;
	} else if (t === 'function') {
		return 'function(){}' === o.toString().replace(/\s/gi, '');
	} else if (t === 'boolean') {
		return false;
	} else {
		if (Array.isArray(o)) {
			return o.length < 1;
		} else {
			const constructor = evl(o.constructor.name, '').toUpperCase();
			if (isAndEquals(true, constructor.startsWith('HTML'), constructor.endsWith('ELEMENT'))) {
				return false;
			}

			return Object.keys(o).length < 1;
		}
	}
};

export const lpad = (arg, pad, size) => {
	let str = "";
	let len = isEmpty(arg) ? 0 : String(arg).length;

	if (len < size) {
		let diff = size - len;
		for (let i = 0; i < diff; i++) {
			str += pad;
		}
	}

	return `${str}${arg}`;
}

export const nvl = (o, d) => {
	return d === null || d === undefined ? d : o;
};

export const evl = (o, d) => {
	return isEmpty(o) ? d : o;
};

export const isOrEquals = (o, ...args) => {
	for (const arg of args) {
		if (o === arg) {
			return true;
		}
	}

	return false;
};

export const isAndEquals = (o, ...args) => {
	for (const arg of args) {
		if (o !== arg) {
			return false;
		}
	}

	return true;
};

export const ignoreEquals = (s, v) => {
	return evl(s, "").toLowerCase() === evl(v, "").toLowerCase()
};

export const getDateString = (date, format) => {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const seconds = date.getSeconds().toString().padStart(2, '0');

	format = evl(format, "").toUpperCase();

	switch (format) {
		case "YYYYMMDD":
			return `${year}${month}${day}`;
		case "YYYY-MM-DD":
			return `${year}-${month}-${day}`;
		case "YYYYMMDDHHMMSS":
			return `${year}${month}${day}${hours}${minutes}${seconds}`;
		case "YYYYMMDD HHMMSS":
			return `${year}${month}${day} ${hours}${minutes}${seconds}`;
		case "YYYY-MM-DD HH:MM:SS":
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		default:
			return date;
	}
};

export const addClass = (element, classList) => {
	const classes = evl(classList, []);
	for (const c of classes) {
		element.classList.add(c);
	}
};

export const removeClass = (element, classList) => {
	const classes = evl(classList, []);
	for (const c of classes) {
		element.classList.remove(c);
	}
};

export const generateUUID = () => {
	return crypto.randomUUID();
};

export const sleep = (ms) => {
	const wakeUpTime = Date.now() + ms;
	while (Date.now() < wakeUpTime) { }
};

export const isDate = (dateString) => {
	const date = new Date(dateString);
	return date instanceof Date && !isNaN(date);
};

export const loginCheck = () => {
	const router = useRouter();
	const assessToken = sessionStorage.getItem('Access-Token');
	//token check
	if (!!assessToken) {
		const tokens = assessToken.split(".");
		if (!isEmpty(tokens) && tokens.length > 1) {

			const info = JSON.parse(atob(tokens[1]));

			//헤더 로그인ID 
			// document.getElementById('headerLoginId').innerText = info.sub; 

			//헤더 로그인일시
			if (!isEmpty(info.loginDtm)) {
				const loginTime = new Date(info.loginDtm * 1000);
				const expTime = new Date(info.exp * 1000).getTime();
				const curTime = new Date().getTime();

				if (expTime < curTime) {
					logout();
				}

				// document.getElementById('userInfoLoginDtm').innerText = common.getDateString(loginTime, "YYYY-MM-DD HH:mm:ss"); 

				// console.log("만료", new Date(info.exp * 1000));
				// loginTimeChecker(expTime);

				return true;
			}
			//헤더 권한
			// document.getElementById('userInfoLoginRoles').innerText = info.roles;
		}
	} else {
		//login화면으로
		console.log("login필요~");
		//router.push({path:'/cmn/Login'});
		// window.location.href = '/cmn/Login'
	}

	return false;
}

export const logout = () => {
	//clearInterval(loginTimeChecker);
	//openMenus = [];
	sessionStorage.removeItem('Access-Token');
	//routeTo('/');
	//common.loadContent(document.getElementById('wrapper'), '/cmn/usr/Login');
};

export const showSnackbar = (msg, color, timeout) => {
	useSnackbar().showSnackbar(msg, color, timeout);
};

export const showLoading = (id, color) => {
	return useLoading().showLoading(id, color);
};

export const hideLoading = (loadingComponent) => {
	useLoading().hideLoading(loadingComponent);
};

export const showModal = async (props) => {
	props.id = generateUUID();
	useModal().showModal(props);
};

export const alert = async (msg, close) => {
	const props = {
		content: msg,
		onClose: close,
		buttons: [
			{
				label: "확인",
				props: { color: "primary", variant: "outlined" },
				// onClick: close, 두번호출되어 주석.
				close: true,
			},
		]
	};
	showModal(props);
};
export const confirm = async (msg, yes, no, close) => {
	const props = {
		content: msg,
		onClose: close,
		buttons: [
			{
				label: "확인",
				props: { color: "primary", variant: "outlined" },
				onClick: yes,
				close: true,
			},
			{
				label: "취소",
				props: { color: "error", variant: "outlined" },
				onClick: no,
				close: true,
			},
		]
	};
	showModal(props);
};

export const openPopup = async (path, buttons, open, close) => {
	// const component = import.meta.glob("/src/views/**/*.vue"); //defineAsyncComponent(() => { await import(path) });
	// const defineComponent = await component;//defineAsyncComponent(() => {});
	const component = defineAsyncComponent(() =>
		import(/* @vite-ignore */`/src/views${path}.vue`)
	);
	// const loadComponent = component[`/src/views${path}.vue`];
	console.log("component", component);
	const props = {
		content: component,
		buttons: buttons
	};
	const a = await showModal(props);
	console.log("a~", a);
}