import { createVNode, render } from "vue";
import { useCommonStore } from "@/stores/common/commonStore";
import ModalComponent from "@/components/common/ModalComponent.vue";

const modalInstances = new Map();

const showModal = ({
    id = String(Date.now()),
    title = "",
    showCloseBtn = true,
    content = "",
    buttons = [],
    btnAlign = "center",
    overlayClose = false,
    width = 400,
    height = 0,
    onOpen = () => { },
    onClose = () => { },
}) => {
    if (modalInstances.has(id)) {
        console.warn(`A modal with ID "${id}" already exists.`);
        return;
    }

    const commonStore = useCommonStore();
    const modalContainer = document.createElement("div");
    document.body.appendChild(modalContainer);

    const vnode = createVNode(ModalComponent, {
        id,
        title,
        showCloseBtn,
        content,
        buttons,
        btnAlign,
        overlayClose,
        width,
        height,
        onOpen,
        onClose: () => {
            onClose();
            closeModal(id);
        },
    });

    vnode.appContext = { ...commonStore.appContext };

    render(vnode, modalContainer);
    modalInstances.set(id, { vnode, container: modalContainer });
};

const closeModal = (id) => {
    const modal = modalInstances.get(id);
    if (!modal) {
        console.warn(`No modal found with ID "${id}".`);
        return;
    }

    render(null, modal.container); // VNode 제거
    document.body.removeChild(modal.container); // DOM에서 제거
    modalInstances.delete(id); // 상태 삭제
};

export const useModal = () => {
    return { showModal, closeModal };
};
