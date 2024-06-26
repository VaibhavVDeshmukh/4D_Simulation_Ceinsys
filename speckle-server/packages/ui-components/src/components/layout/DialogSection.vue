<template>
  <div
    class="flex flex-col border-primary-muted"
    :class="{
      'border-t': borderT,
      'border-b': borderB,
      'relative z-10': isExpanded
    }"
  >
    <div
      class="flex justify-between items-center gap-4 sm:gap-8 py-3 sm:py-4 px-2"
      :class="backgroundClass"
      tabindex="0"
      v-on="
        !button && !alwaysOpen
          ? {
              click: toggleExpansion,
              keypress: keyboardClick(toggleExpansion)
            }
          : {}
      "
    >
      <div
        class="text-sm sm:text-base font-bold flex items-center gap-1 sm:gap-2 select-none"
        :class="titleClasses"
      >
        <div
          v-if="$slots.icon || icon"
          class="h-4 sm:h-5 w-4 sm:w-5 empty:h-0 empty:w-0"
        >
          <slot v-if="$slots.icon" name="icon" />
          <Component :is="icon" v-if="icon" class="w-full h-full" />
        </div>
        <span>{{ title }}</span>
      </div>
      <div>
        <ChevronDownIcon
          v-if="!button && !alwaysOpen"
          class="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-400"
          :class="isExpanded && 'rotate-180'"
        />
        <FormButton
          v-if="button"
          size="sm"
          :to="button.expandContent ? undefined : button.to"
          :color="button.expandContent && isExpanded ? 'invert' : button.color"
          :icon-right="
            button.expandContent && isExpanded ? undefined : button.iconRight
          "
          @click="button?.onClick"
          v-on="button?.expandContent ? { click: toggleExpansion } : {}"
        >
          {{ button.expandContent && isExpanded ? 'Cancel' : button.text }}
        </FormButton>
      </div>
    </div>
    <div
      class="transition-all duration-300 overflow-hidden"
      :class="[
        allowOverflow && isExpanded ? '!overflow-visible' : '',
        isExpanded ? 'mb-3 mt-1' : '',
        !button && !alwaysOpen ? 'cursor-pointer hover:bg-foundation' : ''
      ]"
      :style="
        alwaysOpen
          ? 'max-height: none;'
          : `max-height: ${isExpanded ? contentHeight + 'px' : '0px'}`
      "
    >
      <template v-if="props.lazyLoad">
        <div
          v-if="isExpanded || props.alwaysOpen"
          ref="content"
          class="rounded-md text-sm pb-3 px-2 mt-1"
        >
          <slot>Panel contents</slot>
        </div>
      </template>

      <template v-else>
        <div ref="content" class="rounded-md text-sm pb-3 px-2 mt-1">
          <slot>Panel contents</slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, computed, nextTick } from 'vue'
import type { PropType, Ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { FormButton } from '~~/src/lib'
import { keyboardClick } from '~~/src/helpers/global/accessibility'
import type { PropAnyComponent } from '~~/src/helpers/common/components'

type TitleColor = 'default' | 'danger' | 'warning' | 'success' | 'secondary' | 'info'

type FormButtonColor =
  | 'default'
  | 'invert'
  | 'danger'
  | 'warning'
  | 'success'
  | 'card'
  | 'secondary'
  | 'info'

const props = defineProps({
  title: String,
  borderT: Boolean,
  borderB: Boolean,
  allowOverflow: Boolean,
  titleColor: {
    type: String as () => TitleColor,
    default: 'default'
  },
  button: Object as () =>
    | {
        expandContent?: boolean
        text: string
        to?: string
        color: FormButtonColor
        iconRight?: PropAnyComponent | undefined
        onClick?: () => void
      }
    | undefined,
  alwaysOpen: Boolean,
  lazyLoad: {
    type: Boolean,
    default: false
  },
  icon: {
    type: [Function, Object] as PropType<PropAnyComponent>,
    default: undefined
  }
})

const content: Ref<HTMLElement | null> = ref(null)
const contentHeight = ref(0)
const isExpanded = ref(false)

const backgroundClass = computed(() => {
  const classes = []

  if (!props.button && !props.alwaysOpen) {
    classes.push('cursor-pointer', 'hover:bg-foundation')
  }

  if (isExpanded.value) {
    classes.push('bg-foundation')
  }

  return classes
})

const titleClasses = computed(() => {
  switch (props.titleColor) {
    case 'danger':
      return 'text-danger'
    case 'warning':
      return 'text-warning'
    case 'success':
      return 'text-success'
    case 'secondary':
      return 'text-secondary'
    case 'info':
      return 'text-info'
    default:
      return 'text-foreground'
  }
})

const toggleExpansion = async () => {
  isExpanded.value = !isExpanded.value

  if (isExpanded.value) {
    await nextTick()
    contentHeight.value = (unref(content)?.scrollHeight || 0) + 64
  }
}
</script>
