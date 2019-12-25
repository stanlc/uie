<!-- 图标选择器
<select-icon v-model=[绑定变量] :data=[选项数据] />
-->

<template>
  <el-popover
    placement="bottom-start"
    popper-class="pupop-select-icon"
    transition="el-zoom-in-top"
    trigger="click"
    v-model="popoverVisible"
    :disabled="disabledSelected">
    <!-- 弹出框内容区 -->
    <el-scrollbar
      v-if="popoverVisible"
      class="hide-x"
      :native="false"
      :noresize="false">
      <!-- 图标项 -->
      <div
        class="icon-item"
        v-for="item in options"
        :key="item.id"
        :class="{ 'is-active': isActive(item) }"
        @click="onClickSelected(item)">
        <img :src="item.resource_data" style="width:40px;height:40px;"/>
      </div>
    </el-scrollbar>
    <!-- 页面显示内容区 -->
    <template slot="reference">
      <div :class="{
        'mod-select-icon': 1,
        'is-opened': popoverVisible,
        'is-active': value,
        'is-disabled': disabledSelected
        }">
        <!-- 显示图标 -->
        <div class="icon-item">
          <i :class="value?'hide':'el-icon-plus'"></i>
          <img :src="value" :class="value?'btnImg':'hide'" />
        </div>
        <!-- 清空按钮 -->
        <div v-show="value" class="btn-clear">
          <i class="el-icon-close" @click.stop="onClickClear()"></i>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script>
export default {
  name: 'SelectIcon',
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected',
  },
  props: {
    disabled: Boolean,
    // 接收绑定参数 - 图标类名
    value: {
      type: String,
      required: true,
    },
    // 选项数据，图标类名数组
    options: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    disabledSelected() {
      if (this.disabled) return true;
      return this.$parent.form ? this.$parent.form.disabled : false;
    },
  },
  data() {
    return {
      // 弹出框显示状态
      popoverVisible: false,
    };
  },
  methods: {
    // 是否为当前已选项
    isActive(item) {
      return this.value === item;
    },
    // 选中图标
    onClickSelected(item) {
      this.$emit('selected', item);
      this.popoverVisible = false;
    },
    // 清空选项
    onClickClear() {
      this.$emit('selected', '');
    },
  },
};
</script>

<style lang="scss" scoped>
.btnImg{
    width: 45px;
    height: 45px;
    position: absolute;
    top: -2px;
    left: -2px;
}
.hide{
    display: none !important;
}
.mod-select-icon {
  $size: 40px;    // 图标项大小
  $col-count: 8;  // 多少列
  $row-count: 4;  // 多少行
  $scope: 5px;    // 间隔

  position: relative;
  display: inline-block;
  width: $size + 2px;
  height: $size + 2px;
  border: 1px dashed blue;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  outline: none;

  // 菜单打开状态
  &.is-opened, &:hover { border-color: green; }
  // 禁用状态
  &.is-disabled:hover { border-color: blue !important; } 
  &.is-disabled,
  &.is-disabled > .icon-item,
  &.is-disabled > .btn-clear {
    background-color: gray;
  }
  // 已选状态
  &.is-active {
    border-style: solid;
    border-radius: 0;
    > .icon-item {
      width: $size;
      height: $size;
      line-height: $size;
      padding: $scope;
      position: relative;
      text-align: center;
      cursor: pointer;
      > i {
        display: block;
        width: 100%;
        height: 100%;
        line-height: $size - ($scope * 2);
        color: #fff;
        background-color: green;
      }
    }
  }
  > .icon-item > i { font-size: 16px; }
  > .icon-item > i.el-icon-plus {
    width: 100%;
    line-height: $size;
    font-size: ($size / 2);
    font-weight: bold;
    color: pink;
    cursor: inherit;
  }

  // 清空按钮
  .btn-clear {
    width: 0;
    height: 0;
    border-width: ($size / 2) 0 0 ($size / 2);
    border-style: solid;
    border-color: red transparent transparent transparent;
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    > i.el-icon-close {
      position: absolute;
      top: -($size / 2);
      right: 0;
      color: #fff;
      font-size: .7em;
      &:hover { color: darken(#fff, 5%); }
    }
  }

  // 弹出内容
  @at-root .el-popover.el-popper.pupop-select-icon {
    display: block;
    padding: 0;
    width: ($size + $scope * 2) * $col-count + 2px;
    height: ($size + $scope * 2) * $row-count;

    > .el-scrollbar { height: 100%; }
    

    .icon-item {
      float: left;
      width: $size;
      height: $size;
      line-height: $size;
      margin: $scope;
      padding: $scope;
      text-align: center;
      cursor: pointer;
      &:hover { background-color: aqua; }
      &.is-active {
        background-color: pink;
        border: 1px solid pink;
      }
      > i {
        display: block;
        width: 100%;
        height: 100%;
        font-size: 16px;
        line-height: $size - ($scope * 2);
        color: #fff;
        background-color: green;
      }
    }
  }
}
</style>