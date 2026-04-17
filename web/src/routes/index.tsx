
import { MenuDef } from "@palmyralabs/rt-forms";
import { Outlet, Route } from "react-router-dom";
import { appRoutes } from "./AppRoutes";
import PageWrapper from "./PageWrapper";


function getHandler(route: any, path: any) {
  //@ts-ignore
  const idProperty = route.idProperty || 'id';

  if (route.element) {
    return <Route
      path={route.path}
      element={<PageWrapper state={route.state}>
        {route.element}
      </PageWrapper>}
      key={path}
    />
  }

  return (
    <Route key={path} path={route.path} element={<Outlet />} >

    </Route>
  )
}

const getIndexRoute = (path: string, route: any, key: any) => {
  return <Route
    index
    path={path}
    element={<PageWrapper state={route.state}>
      {route.element}
    </PageWrapper>}
    key={key}
  />
}


const generateRoute = (routes: any, parentPath?: string) => {
  return routes.map((route: any, index: number) => {
    let path = (parentPath) ? parentPath + "/" + route.path : route.path;

    if (route.idProperty) {
      return getHandler(route, path);
    }

    return route.index ? getIndexRoute(path, route, index) : (
      <Route
        path={route.path}
        element={
          route.element
        }
        key={path}
      >
        {route.children && (
          generateRoute(route.children, path)
        )}
      </Route>
    )
  });
};


const generateMenu = (routes: any, parentPath?: string): MenuDef[] => {
  return routes
    .filter((route: any) => route.path)
    .map((route: any) => {
      let path = (parentPath) ? parentPath + "/" + route.path : route.path;
      var result: MenuDef = {
        name: route.name || route.path,
        path, title: route.name
      };

      if (route.children) {
        result.children = generateMenu(route.children, path);
      }
      return result;
    });
};
export const routes = generateRoute(appRoutes);