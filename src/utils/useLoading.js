import { createVNode, render } from 'vue';
import { useCommonStore } from "@/stores/common/commonStore";
import LoadingComponent from '@/components/common/LoadingComponent.vue';

export const useLoading = () => {

    const showLoading = (id = "", color = "primary", key = "") => {
        const commonStore = useCommonStore();
        let targetElement;

        // id가 주어지면 해당 노드에 로딩 표시, 아니면 body에 표시
        if (id) {
            targetElement = document.getElementById(id); // id로 해당 요소 선택
        } else {
            targetElement = document.body; // id가 없으면 전체 화면에 로딩 표시
        }

        // id가 주어졌지만 해당 요소가 없다면 경고
        if (!targetElement) {
            console.warn(`No element found with id "${id}"`);
            return;
        }

        // 동적 컴포넌트 생성
        const container = document.createElement("div");
        targetElement.appendChild(container);

        const vnode = createVNode(LoadingComponent, {
            color,
            onClose: () => {
                render(null, container);
                document.body.removeChild(container);
            },
        });

        vnode.appContext = { ...commonStore.appContext }; // appContext 연결

        // 로딩 컴포넌트 렌더링
        render(vnode, container);

        // 상태 업데이트
        return { container, vnode };

    };

    const hideLoading = (loadingComponent) => {

        if (loadingComponent) {
            const { container, targetElement } = loadingComponent;

            console.log("hideLoading", loadingComponent);

            // Vue 렌더링 제거
            render(null, container);

            // DOM에서 컨테이너 제거
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }
    };
    // const showLoading = (id = "", color = "primary") => {
    //   const commonStore = useCommonStore();
    //   let el = null;
    // //   if (currentLoadingInstance) {
    // //     console.warn("Loading already displayed.");
    // //     return;
    // //   }

    //   // DOM 컨테이너 생성
    //   const container = document.createElement("div");
    //   if(id) {
    //     el = document.querySelector(`#${id}`);
    //   } else {
    //     el = document.body;
    //   }

    //   if(!el) {
    //     console.error("엘리먼트 확인");
    //     return;
    //   }

    //   el.appendChild(container);

    //   // 동적 컴포넌트 생성
    //   const vnode = createVNode(LoadingComponent, { color });
    //   vnode.appContext = {... commonStore.appContext}; // appContext 연결

    //   // 현재 인스턴스 저장
    //   currentLoadingInstance = { vnode, container };

    //   // 렌더링
    //   render(vnode, container);
    // };

    // const hideLoading = () => {
    //   if (currentLoadingInstance) {
    //     const { container } = currentLoadingInstance;

    //     // 컴포넌트 제거
    //     render(null, container);
    //     document.body.removeChild(container);

    //     // 상태 초기화
    //     currentLoadingInstance = null;
    //   }
    // };

    return { showLoading, hideLoading };
};