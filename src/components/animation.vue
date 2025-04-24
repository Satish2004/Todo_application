<template>
  <div class="w-full h-full relative">
    <!-- SVG for Blob Effect -->
    <svg style="position: absolute; width: 0; height: 0;">
      <filter id="blob">
        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="30" />
        <feColorMatrix
          in="blur"
          values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10"
        />
      </filter>
    </svg>

    <!-- Main Blob Cursor -->
    <div
      ref="cursorContainer"
      class="absolute w-full h-full overflow-hidden bg-transparent select-none cursor-default"
      @mousemove="handleMove"
      @touchmove="handleMove"
    >
      <div v-for="(trail, index) in trail" :key="index" class="absolute">
        <div
          :style="{
            width: `${sizes[index].width}px`,
            height: `${sizes[index].height}px`,
            transform: `translate3d(${trail.xy[0]}px, ${trail.xy[1]}px, 0)`,
            backgroundColor: fillColor,
            borderRadius: blobType === 'circle' ? '50%' : '0%',
            willChange: 'transform',
          }"
          class="shadow-[10px_10px_5px_0_rgba(0,0,0,0.75)] opacity-60"
        >
          <!-- Pseudo-element replacement -->
          <div
            class="pointer-events-none absolute"
            :style="{
              top: `${pseudoStyles[index].top}px`,
              left: `${pseudoStyles[index].left}px`,
              width: `${pseudoStyles[index].width}px`,
              height: `${pseudoStyles[index].height}px`,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.8)',
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useMouse } from "@vueuse/core";
import { gsap } from "gsap";

export default {
  props: {
    blobType: {
      type: String,
      default: 'circle',
    },
    fillColor: {
      type: String,
      default: '#00f0ff',
    },
  },
  setup(props) {
    // Reactive state
    const cursorContainer = ref(null);
    const trail = ref([
      { xy: [0, 0] },
      { xy: [0, 0] },
      { xy: [0, 0] },
    ]);
    const { x, y } = useMouse();

    const fast = { tension: 1200, friction: 40 };
    const slow = { mass: 10, tension: 200, friction: 50 };

    const sizes = [
      { width: 60, height: 60 },
      { width: 125, height: 125 },
      { width: 75, height: 75 },
    ];

    const pseudoStyles = [
      { top: 20, left: 20, width: 20, height: 20 },
      { top: 35, left: 35, width: 35, height: 35 },
      { top: 25, left: 25, width: 25, height: 25 },
    ];

    // Cursor movement logic
    const handleMove = (event) => {
      const { clientX: x, clientY: y } = event;
      updateTrailPosition(x, y);
    };

    // Update trail positions
    const updateTrailPosition = (x, y) => {
      const containerRect = cursorContainer.value.getBoundingClientRect();
      const left = containerRect.left;
      const top = containerRect.top;

      trail.value.forEach((_, index) => {
        gsap.to(trail.value[index], {
          xy: [x - left, y - top],
          duration: index === 0 ? 0.1 : 0.2, // Different duration for each trail
          ease: index === 0 ? "power4.out" : "power3.out",
        });
      });
    };

    // Update trail on mouse position change
    onMounted(() => {
      nextTick(() => {
        updateTrailPosition(x.value, y.value);
      });
    });

    // Watch for mouse movement and update trail
    nextTick(() => {
      trail.value.forEach((trailItem, index) => {
        gsap.set(trailItem, { xy: [x.value, y.value] });
      });
    });

    return {
      trail,
      cursorContainer,
      sizes,
      pseudoStyles,
      fillColor: props.fillColor,
      blobType: props.blobType,
      handleMove,
    };
  },
};
</script>

<style scoped>
/* Preloader and login transitions (optional styles can go here) */
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.pointer-events-none {
  pointer-events: none;
}
</style>
