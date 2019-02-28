<template>
  <div class="container">
    <ButtonGroup v-if="!hideArrow" shape="circle" class="scroll-control">
      <Button size="small" @click="pagePrev">←</Button>
      <Button size="small" @click="pageNext">→</Button>
    </ButtonGroup>
    <div class="wrapper" @wheel="handleWheelScroll">
      <div class="floating" ref="floatingBar" :style="{left: this.offset + 'px'}">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  const FACTOR = 0.7;
  export default {
    name: 'horizontal-scroll-wrapper',
    data: function() {
      return {
        offset: 0,
        hideArrow: true,
      };
    },
    methods: {
      pagePrev() {
        if (this.offset + this.wrapperWidth() * FACTOR > 0) {
          this.offset = 0;
        } else {
          this.offset += this.wrapperWidth() * FACTOR;
        }
      },
      pageNext() {
        if (this.offset + this.floatingBarWidth() - this.wrapperWidth() * FACTOR < 0) {
          return;
        } else {
          this.offset -= this.wrapperWidth() * FACTOR;
        }
      },
      handleWheelScroll (e) {
        if (this.hideArrow) {
          // note on-scroll behaves the same as scroll button
          return;
        }
        const deltaY = -e.wheelDeltaY || e.deltaY;
        if (deltaY < 0) {
          // scroll up -> prev
          this.pagePrev();
        } else if (deltaY > 0) {
          // scroll down -> next
          this.pageNext();
        }
      },
      wrapperWidth() {
        return this.$el.offsetWidth;
      },
      floatingBarWidth() {
        return this.$refs.floatingBar.offsetWidth;
      },
      updateHideArrow() {
        this.hideArrow = this.wrapperWidth() >= this.floatingBarWidth();
      }
    },
    watch: {
      hideArrow(newValue) {
        if (newValue === true) {
          this.offset = 0;
        }
      }
    }
  };
</script>

<style scoped>
    .container {
      position: relative;
    }
    .wrapper {
      overflow: hidden;
      /* for test use */
      /*background-color: gold;*/
    }
    .floating {
      width: max-content;
      overflow: auto;
      position: relative;
      transition: left 0.3s;
    }
    .scroll-control {
      float: right;
      margin-top: 18px;
      opacity: 0.6;
      padding-left: 3px;
    }

</style>
