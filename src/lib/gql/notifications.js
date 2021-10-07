import { gql } from "@apollo/client";
import { notificationFragment } from "~/lib/gql/_fragments";

export const UPDATE_NOTIFICATION = gql`
  ${notificationFragment}
  mutation UpdateNotification($id: Int!, $data: stt_notification_set_input) {
    update_stt_notification_by_pk(pk_columns: { id: $id }, _set: $data) {
      ...notificationFragment
    }
  }
`;
