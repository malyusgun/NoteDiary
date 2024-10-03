import type { IToggleButtonOption, ISliderOption } from '@/app/interfaces/ui';

const imageScaleOptions: ISliderOption[] = [
  {
    label: 'x0.25',
    value: '0',
    color: 'var(--purple-700)'
  },
  {
    label: 'x0.5',
    value: '1',
    color: 'var(--indigo-500)'
  },
  {
    label: 'x0.75',
    value: '2',
    color: 'var(--sky-500)'
  },
  {
    label: 'x1',
    value: '3',
    color: 'var(--green-500)'
  },
  {
    label: 'x1.25',
    value: '4',
    color: 'var(--yellow-500)'
  },
  {
    label: 'x1.5',
    value: '5',
    color: 'var(--orange-500)'
  },
  {
    label: 'x1.75',
    value: '6',
    color: 'var(--red-500)'
  },
  {
    label: 'x2',
    value: '7',
    color: 'var(--red-800)'
  }
];
const entityIsTitleOptions = ref<IToggleButtonOption[]>([
  {
    label: 'Off',
    value: false,
    textStyle: 'bold'
  },
  {
    label: 'On',
    value: true,
    textStyle: 'bold'
  }
]);
const entityIsTextOptions = ref<IToggleButtonOption[]>([
  {
    label: 'Off',
    value: false,
    textStyle: 'bold'
  },
  {
    label: 'On',
    value: true,
    textStyle: 'bold'
  }
]);
const entityPositionOptions = ref<IToggleButtonOption[]>([
  {
    label: 'left',
    isLabelHidden: true
  },
  {
    label: 'center',
    isLabelHidden: true
  },
  {
    label: 'right',
    isLabelHidden: true
  }
]);
const entityTitlePositionOptions = ref<IToggleButtonOption[]>([
  {
    label: 'left',
    isLabelHidden: true
  },
  {
    label: 'center',
    isLabelHidden: true
  },
  {
    label: 'right',
    isLabelHidden: true
  }
]);
const entityTextPositionOptions = ref<IToggleButtonOption[]>([
  {
    label: 'Left',
    value: 'left',
    textStyle: 'bold'
  },
  {
    label: 'Right',
    value: 'right',
    textStyle: 'bold'
  }
]);
const isEntityWidthFullOptions = ref<IToggleButtonOption[]>([
  {
    label: 'Half',
    value: false,
    textStyle: 'bold'
  },
  {
    label: 'Full',
    value: true,
    textStyle: 'bold'
  }
]);
export {
  imageScaleOptions,
  entityIsTitleOptions,
  entityIsTextOptions,
  entityPositionOptions,
  entityTitlePositionOptions,
  entityTextPositionOptions,
  isEntityWidthFullOptions
};
