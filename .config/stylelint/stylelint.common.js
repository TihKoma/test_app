import { propertyGroups } from 'stylelint-config-clean-order';

const propertiesOrder = propertyGroups.map((properties) => {
  return {
    noEmptyLineBetween: true,
    emptyLineBefore: 'always', // Don't add empty lines between order groups.
    properties,
  };
});

export default {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
  plugins: ['stylelint-order', 'stylelint-prettier', 'stylelint-no-unsupported-browser-features'],
  rules: {
    'prettier/prettier': true,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'number-max-precision': null,
    'font-family-no-missing-generic-family-keyword': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'selector-id-pattern': null,
    'media-feature-range-notation': null,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'export'] }],
    'declaration-empty-line-before': null,
    'order/properties-order': [propertiesOrder, { severity: 'error', unspecified: 'bottomAlphabetical' }],
    'declaration-property-value-no-unknown': null,
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        ignore: ['css-nesting', 'css-scrollbar'],
        ignorePartialSupport: true,
      },
    ],
  },
  ignoreFiles: [
    'dist/**/*.css',
    'src/**/presets/**/*.css',
    // Landing pages and widgets — temporary lint stubs
    'src/pages/{MainPage,PagerPage,PricingPage,QueuePage}/**/*.{css,scss}',
    'src/widgets/{Landing,Pricing,Queue,Pager}*/**/*.{css,scss}',
  ],
};
