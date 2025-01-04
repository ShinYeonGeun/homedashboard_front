import { createVNode, render, shallowRef, markRaw } from "vue";
import { useCommonStore } from "@/stores/common/commonStore";
import ModalComponent from "@/components/common/ModalComponent.vue";

// const modalInstances = new Map();

const showModal = ({
    id = String(Date.now()),
    title = "",
    showCloseBtn = true,
    content = "",
    contentProps = {},
    buttons = [],
    btnAlign = "center",
    overlayClose = false,
    width = 400,
    height = 0,
    onOpen = () => { },
    onClose = () => { },
}) => {

    const commonStore = useCommonStore();
    const modalContainer = document.createElement("div");
    modalContainer.dataset.uuid = id;
    document.body.appendChild(modalContainer);
    return new Promise((resolve) => {
        // const vnode = createVNode(ModalComponent, {
        //     id,
        //     title,
        //     showCloseBtn,
        //     content,
        //     contentProps,
        //     buttons,
        //     btnAlign,
        //     overlayClose,
        //     width,
        //     height,
        //     onOpen, // 전달
        //     onClose: (data) => {
        //         onClose(data); // 사용자가 설정한 onClose 호출
        //         resolve(data); // 데이터를 Promise로 반환
        //     },
        // });
        // vnode.key = id;
        // vnode.appContext = { ...commonStore.appContext };
        // render(vnode, modalContainer);

        const vnode = createVNode(ModalComponent, {
            id,
            title,
            showCloseBtn,
            content: markRaw(content),
            contentProps,
            buttons,
            btnAlign,
            overlayClose,
            width,
            height,
            onOpen, // 전달
            onClose: (data) => {
                onClose(data); // 사용자가 설정한 onClose 호출
                resolve(data); // 데이터를 Promise로 반환
            },
        });
        vnode.key = id;
        vnode.appContext = commonStore.appContext;

        render(vnode, modalContainer);
    });
};

export const useModal = () => {
    return { showModal };
};
