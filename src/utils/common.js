import { useRouter } from 'vue-router';
import { useSnackbar } from '@/utils/useSnackbar';
import { useLoading } from '@/utils/useLoading';
import { useModal } from '@/utils/useModal';
import { defineAsyncComponent, markRaw } from 'vue'
import { useCommonStore } from '@/stores/common/commonStore'
import CryptoJS from 'crypto-js';

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
			// const token = headers.get('Access-Token');
			// if (token) {
			// 	sessionStorage.setItem('Access-Token', token);
			// }

			if (res.resultCd === 'S' && sccessFunc) {
				sccessFunc(data, res);
			} else if (res.resultCd === 'E' && errorFunc) {
				errorFunc(data, res);
			}

		} else {

			showSnackbar('시스템 오류가 발생했습니다.', colorList.DANGER);

			console.error("res", res, response);

			if (res.status) {
				if (res.status >= 400 && res.status < 600) {
					if (res.status == 401) {
						window.location.href = '/cmn/Login';
					} else {
						if (errorFunc) {
							errorFunc(data, res);
						}
					}
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

export const getDateString = (date, format, emptyChar) => {
	return isEmpty(date) ? nvl(emptyChar, "") : getDateFormat(new Date(date), format);
};

export const getDateFormat = (date, format) => {
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
					return false;
				}

				return true;
			}
			//헤더 권한
			// document.getElementById('userInfoLoginRoles').innerText = info.roles;
		}
	}

	return false;
}

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
	return await useModal().showModal(props);
};

export const alert = async (msg, close, option) => {
	const props = {
		content: msg,
		onClose: close,
		buttons: [
			{
				label: "확인",
				props: { color: "primary", variant: "outlined", size: "small" },
				close: true,
			},
		]
	};

	Object.assign(props, option);

	showModal(props);
};

export const infoAlert = async (msg, close) => {
	const props = {
		content: `<span><span class="mdi mdi-information-outline me-2"></span><span>${msg}</span></span>`,
		noHeader: true,
		noHeaderDivider: true,
		noFooterDivider: true,
		buttons: [
			{
				label: "확인",
				props: { color: "primary", variant: "outlined", size: "small" },
				close: true,
			},
		]
	};
	alert(msg, close, props);
};

export const errorAlert = async (msg, close) => {
	const props = {
		content: `<span><span class="mdi mdi-alert-circle-outline me-2"></span><span>${msg}</span></span>`,
		noHeader: true,
		noHeaderDivider: true,
		noFooterDivider: true,
		buttons: [
			{
				label: "확인",
				props: { color: "error", variant: "outlined", size: "small" },
				close: true,
			},
		]
	};
	alert(msg, close, props);
};

export const confirm = async (msg, yes, no, close) => {
	const props = {
		content: msg,
		noHeader: true,
		noHeaderDivider: true,
		noFooterDivider: true,
		onClose: close,
		buttons: [
			{
				label: "확인",
				props: { color: "primary", variant: "outlined", size: "small" },
				onClick: yes,
				close: true,
			},
			{
				label: "취소",
				props: { color: "", variant: "outlined", size: "small" },
				onClick: no,
				close: true,
			},
		]
	};
	showModal(props);
};

export const openPopup = async (path, buttons, open, close) => {

	const component = defineAsyncComponent(() =>
		import(/* @vite-ignore */`/src/views${path}.vue`)
	);

	const props = {
		content: component,
		buttons: buttons
	};
	const a = await showModal(props);
}

export const adjustHeight = (props) => {

	let height = document.querySelector(props.base).offsetHeight;

	for (const i of props.excludes) {
		try {
			height -= document.querySelector(i).offsetHeight;
		} catch (e) {
			//오류스킵
		}
	}

	if (props.reduce) {
		height -= props.reduce;
	}

	document.querySelector(props.target).style.height = `${height}px`;

	if (evl(props.isMin, false)) {
		document.querySelector(props.target).style["min-height"] = `${height}px`;
	}

	if (evl(props.isMax, false)) {
		document.querySelector(props.target).style["max-height"] = `${height}px`;
	}

	return height;
}

export const commonAdjustHeight = () => {
	return adjustHeight({ target: ".app-container", base: "#content-wrap", excludes: [".search-area"] });
}

export const searchComCodeList = async ({
	codeList = [],
	codeDelYn = '',
	codeDetailDelYn = ''
}) => {
	let codes = {};
	await sendByTrnCd('CCD03R01', { codeList: ['USER_STATE'] }, (d, r) => {
		if (r.resultCd === 'S') {
			Object.assign(codes, r.payload);
		} else {
			codes = null;
		}

	}, (params, res) => {
		console.log("error", res);
		common.showSnackbar(`공통코드 조회 중 오류가 발생되었습니다.`, "red", 2000);
	});

	return codes;
};

export const colorList = {
	EXCEL_DOWNLOAD: '#217346',
	DANGER: '#b71c1c',
	REFRESH_BUTTON: 'grey-darken-1',
	GRID_SELECTED_ROW: 'grey-lighten-3'
}

// 깊은 복사 함수
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const getCommCodeData = (commonCode) => {
	return useCommonStore().getCommCodeData(commonCode);
};

export const getCommCodeItems = (commonCode) => {
	const commCodeData = useCommonStore().getCommCodeData(commonCode);
	return isEmpty(commCodeData) ? [] : commCodeData.codeList;
};

export const getLoginId = () => useCommonStore().loginId;

export const isNumber = (v) => /^([+-]?)(\d*)(\.?\d*)$/.test(v);

/**
 * 맨 앞 부호, 그 후에는 숫자 or 소수점 제외하고 전부 제거
 */
export const cleanNumber = (input) => {
	return evl(input, '').toString().replace(/[^0-9.+-]/g, "").replace(/^([-+]?)(.*)/, (_, sign, number) => sign + number.replace(/[^0-9.]/g, ""));
};

/**
 * 숫자 천단위 콤마
 */
export const numberFormat = (num) => {
	num = cleanNumber(num);
	return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

// 🔹 AES-256 CBC 암호화
export const encryptAES = (text) => {
	return CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(import.meta.env.VITE_AES_SECRET_KEY.padEnd(32, "=")), {
		iv: CryptoJS.enc.Utf8.parse(import.meta.env.VITE_AES_IV.padEnd(16, "=")),
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	}).toString();
};

// 🔹 AES-256 CBC 복호화
export const decryptAES = (cipherText) => {
	return CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Utf8.parse(import.meta.env.VITE_AES_SECRET_KEY.padEnd(32, "=")), {
		iv: CryptoJS.enc.Utf8.parse(import.meta.env.VITE_AES_IV.padEnd(16, "=")), // 암호화할 때와 다른 IV 사용
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	}).toString(CryptoJS.enc.Utf8);
};