<template>
  <Btn
    :disabled="disabled"
    :onClick="
      () => {
        if (onClick) {
          onClick();
        }
        if (!disabled && !hideActionButton) {
          commonAction({ no_target: noTarget })
        }
      }
    "
  ></Btn>
  <!-- TODO 死人不能行动 -->
</template>

<script lang="ts">
  import { ComputedRef, defineComponent } from "vue";

  import Btn from "../../components/Btn.vue";
  import { commonAction } from "./commonAction";

  const ActionBtn = defineComponent({
    name: "ActionBtn",
    components: { Btn },
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      /** 当前操作是否是有目标的操作, 如结束发言就没有目标 */
      noTarget: {
        type: Boolean,
        default: false,
      },
      onClick: {
        type: Function,
        required: false,
      },
      hideActionButton: {
        type: Boolean,
        required: false,
      }
    },
    setup(props) {
      return { commonAction, hideActionButton: props.hideActionButton };
    },
  });

  export default ActionBtn;
</script>

<style lang="scss" scoped></style>
