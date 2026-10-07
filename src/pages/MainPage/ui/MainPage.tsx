import { Typography } from 'antd';

import styles from './MainPage.module.scss';

export const MainPage = () => (
  <main className={styles.root}>
    <Typography.Title data-testid={'main-page-title'} level={1}>
      Hello world
    </Typography.Title>
  </main>
);
