//package com.palmyralabs.dms.jpa.query;
//
//import com.palmyralabs.palmyra.handlers.NativeQueryResponse;
//
//public class AclMenuQuery {
//	private static final String ACL_MENU_PARENT_QUERY = "SELECT  menu.id, menu.name, menu.code, menu.action, "
//			+ " menu.display_order FROM xpm_menu menu inner JOIN xpm_acl_menu xam ON xam.menu_id = menu.id"
//			+ " inner join xpm_acl_user xau on xau.group_id = xam.group_id and xau.active = 1 and menu.active = 1"
//			+ " inner join xpm_group xg on xg.id = xam.group_id and xg.active = 1 and menu.active = 1"
//			+ " inner join xpm_user xu on xu.id = xau.user_id WHERE  xu.login_name  = ? "
//			+ " and xam.mask > 0 and menu.parent is null GROUP BY menu.id";
//
//	private static final String ACL_MENU_CHILD_QUERY = "WITH RECURSIVE sidemenu AS ("
//			+ " SELECT menu.id, menu.name, menu.code, menu.action, menu.parent, menu.display_order, menu.icon "
//			+ " FROM xpm_menu menu INNER JOIN xpm_acl_menu xam ON xam.menu_id = menu.id"
//			+ " INNER JOIN xpm_acl_user xau ON xau.group_id = xam.group_id AND xau.active = 1 AND menu.active = 1"
//			+ " INNER JOIN xpm_user xu ON xu.id = xau.user_id WHERE xu.login_name = ? "
//			+ " AND xam.mask > 0 AND menu.parent = ? UNION ALL SELECT m.id, m.name, m.code, m.action, m.parent, m.display_order, m.icon"
//			+ " FROM xpm_menu m INNER JOIN sidemenu sm ON m.parent = sm.id"
//			+ " ) SELECT sm.id, sm.name, sm.code, sm.action, sm.parent, string_agg(child.id::text, ',' ORDER BY child.display_order) AS children, sm.icon "
//			+ " FROM sidemenu sm LEFT JOIN sidemenu child ON child.parent = sm.id"
//			+ " GROUP BY sm.id, sm.name, sm.code, sm.action, sm.parent, sm.display_order, sm.icon "
//			+ " ORDER BY sm.display_order";
//
//	public NativeQueryResponse getParentMenu(String user) {
//		return new NativeQueryResponse(ACL_MENU_PARENT_QUERY, user);
//	}
//
//	public NativeQueryResponse getChildMenu(String user, Integer parent) {
//		return new NativeQueryResponse(ACL_MENU_CHILD_QUERY, user, parent);
//	}
//}
