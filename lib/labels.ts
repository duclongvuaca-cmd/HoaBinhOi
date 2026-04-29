export const POI_STATUS_LABEL: Record<string, string> = {
  draft: "Nháp",
  published: "Đã đăng",
  archived: "Đã ẩn"
};

export const REVIEW_STATUS_LABEL: Record<string, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Đã từ chối"
};

export const ROLE_LABEL: Record<string, string> = {
  admin: "Quản trị",
  editor: "Biên tập"
};

export const ACTION_LABEL: Record<string, string> = {
  insert: "Thêm",
  update: "Sửa",
  delete: "Xoá",
  approve: "Duyệt",
  reject: "Từ chối",
  invite: "Mời",
  role_change: "Đổi quyền",
  revoke: "Thu hồi"
};

export const RESOURCE_LABEL: Record<string, string> = {
  pois: "Địa điểm",
  reviews: "Đánh giá",
  admin_users: "Người dùng",
  itineraries: "Hành trình"
};

export function tr(map: Record<string, string>, key: string): string {
  return map[key] || key;
}
