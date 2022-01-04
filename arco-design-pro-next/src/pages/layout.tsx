import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { Layout, Menu, Breadcrumb } from '@arco-design/web-react';
import {
  IconDashboard,
  IconList,
  IconSettings,
  IconFile,
  IconApps,
  IconCheckCircle,
  IconExclamationCircle,
  IconUser,
  IconMenuFold,
  IconMenuUnfold,
} from '@arco-design/web-react/icon';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import qs from 'query-string';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { routes, defaultRoute } from '@/routes';
import { isArray } from '@/utils/is';
import useLocale from '@/utils/useLocale';
import { GlobalState } from '@/store';
import getUrlParams from '@/utils/getUrlParams';
import styles from '@/style/layout.module.less';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const Sider = Layout.Sider;
const Content = Layout.Content;

function getIconFromKey(key) {
  switch (key) {
    case 'dashboard':
      return <IconDashboard className={styles.icon} />;
    case 'list':
      return <IconList className={styles.icon} />;
    case 'form':
      return <IconSettings className={styles.icon} />;
    case 'profile':
      return <IconFile className={styles.icon} />;
    case 'visualization':
      return <IconApps className={styles.icon} />;
    case 'result':
      return <IconCheckCircle className={styles.icon} />;
    case 'exception':
      return <IconExclamationCircle className={styles.icon} />;
    case 'user':
      return <IconUser className={styles.icon} />;
    default:
      return <div className={styles['icon-empty']} />;
  }
}

function PageLayout({ children }: { children: ReactNode }) {
  const urlParams = getUrlParams();
  const router = useRouter();
  const pathname = router.pathname;
  const currentComponent = qs.parseUrl(pathname).url.slice(1);
  const currentSubKey = qs.parseUrl(pathname).url.split('/')[1];
  const defaultSelectedKeys = [currentComponent || defaultRoute];

  const locale = useLocale();
  const settings = useSelector((state: GlobalState) => state.settings);

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);

  const navbarHeight = 60;
  const menuWidth = collapsed ? 48 : settings?.menuWidth;

  const showNavbar = settings?.navbar && urlParams.navbar !== false;
  const showMenu = settings?.menu && urlParams.menu !== false;
  const showFooter = settings?.footer && urlParams.footer !== false;

  const routeMap = useRef<Map<string, string[]>>(new Map());

  const [breadcrumb, setBreadCrumb] = useState([]);

  function onClickMenuItem(key) {
    setSelectedKeys([key]);
  }

  function toggleCollapse() {
    setCollapsed((collapsed) => !collapsed);
  }

  const paddingLeft = showMenu ? { paddingLeft: menuWidth } : {};
  const paddingTop = showNavbar ? { paddingTop: navbarHeight } : {};
  const paddingStyle = { ...paddingLeft, ...paddingTop };

  function renderRoutes(locale) {
    const nodes = [];
    function travel(_routes, level, parentName = '') {
      return _routes.map((route) => {
        const titleDom = (
          <>
            {getIconFromKey(route.key)} {locale[route.name] || route.name}
          </>
        );
        if (
          route.key &&
          (!isArray(route.children) ||
            (isArray(route.children) && !route.children.length))
        ) {
          routeMap.current.set(
            `/${route.key}`,
            parentName ? [parentName, route.name] : [route.name]
          );

          if (level > 1) {
            return (
              <MenuItem key={route.key}>
                <Link href={`/${route.key}`}>
                  <a>{titleDom}</a>
                </Link>
              </MenuItem>
            );
          }

          nodes.push(
            <MenuItem key={route.key}>
              <Link href={`/${route.key}`}>
                <a>{titleDom}</a>
              </Link>
            </MenuItem>
          );
        }
        if (isArray(route.children) && route.children.length) {
          if (level > 1) {
            return (
              <SubMenu key={route.key} title={titleDom}>
                {travel(route.children, level + 1, route.name)}
              </SubMenu>
            );
          }
          nodes.push(
            <SubMenu key={route.key} title={titleDom}>
              {travel(route.children, level + 1, route.name)}
            </SubMenu>
          );
        }
      });
    }
    travel(routes, 1);
    return nodes;
  }

  useEffect(() => {
    const routeConfig = routeMap.current.get(pathname);
    setBreadCrumb(routeConfig || []);
  }, [pathname]);

  return (
    <Layout className={styles.layout}>
      {showNavbar && (
        <div className={styles['layout-navbar']}>
          <Navbar />
        </div>
      )}
      <Layout>
        {showMenu && (
          <Sider
            className={styles['layout-sider']}
            width={menuWidth}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            trigger={null}
            collapsible
            breakpoint="xl"
            style={paddingTop}
          >
            <div className={styles['menu-wrapper']}>
              <Menu
                collapse={collapsed}
                onClickMenuItem={onClickMenuItem}
                selectedKeys={selectedKeys}
                defaultOpenKeys={[currentSubKey]}
              >
                {renderRoutes(locale)}
              </Menu>
            </div>
            <div className={styles['collapse-btn']} onClick={toggleCollapse}>
              {collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
            </div>
          </Sider>
        )}
        <Layout className={styles['layout-content']} style={paddingStyle}>
          <div className={styles['layout-content-wrapper']}>
            <div className={styles['layout-breadcrumb']}>
              <Breadcrumb>
                {breadcrumb.map((name) => (
                  <Breadcrumb.Item key={name}>{locale[name]}</Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </div>
            <Content>{children}</Content>
          </div>
          {showFooter && <Footer />}
        </Layout>
      </Layout>
    </Layout>
  );
}

export default PageLayout;
