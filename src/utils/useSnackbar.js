import { createVNode, render } from "vue";
import SnackbarComponent from "@/components/common/SnackbarComponent.vue"; // 동적 Snackbar 컴포넌트
import { useCommonStore } from "@/stores/common/commonStore";

export function useSnackbar() {
  //timeout 이 -1 이면 자동으로 안닫히고 계속 열려있음.
  const showSnackbar = (message, color = "primary", timeout = 3000) => {
    const commonStore = useCommonStore();

    if (!commonStore.appContext) {
      throw new Error("App context is not available. Make sure it's set in commonStore.");
    }

    // DOM 컨테이너 생성
    const container = document.createElement("div");
    document.body.appendChild(container);

    // 동적 Snackbar 생성
    const vnode = createVNode(SnackbarComponent, {
      message,
      color,
      timeout,
      modelValue: true, // v-model 상태
      "onUpdate:modelValue": (newValue) => {
        if (!newValue) {
          render(null, container);
          document.body.removeChild(container);
        }
      },
    });

    // 앱 컨텍스트 연결
    vnode.appContext = {... commonStore.appContext};

    // DOM에 렌더링
    render(vnode, container);
  };

  return { showSnackbar };
}
// export function useSnackbar() {
//   const showSnackbar = (message, color = "primary", timeout = 3000) => {
//     // 동적 DOM 컨테이너 생성
//     const container = document.createElement("div");
//     document.body.appendChild(container);

//     // Vue 앱 생성
//     const app = createApp({
//       render() {
//         return createVNode(SnackbarComponent, {
//           message,
//           color,
//           timeout,
//           onClose: () => {
//             app.unmount(); // Vue 앱 언마운트
//             document.body.removeChild(container); // DOM 제거
//           },
//         });
//       },
//     });

//     // Vuetify 연결
//     app.use(vuetify);
//     app.mount(container);
//   };

//   return { showSnackbar };
// }