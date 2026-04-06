import { db } from "../config/db";
import { NotificationTable } from "../db/schema/notifications";


type Notification = 'ISSUE_ASSIGNED' | 'COMMENT_ON_ISSUE' | 'MENTIONED' | 'INVITE_ACCEPTED' | "INVITE_ISSUED" | "REMOVED"

export const sendNotification = async (data: {
    type: Notification,
    message: string,
    link: string,
    user_id: string,
    workspace_id: string
}) => {
    await db.insert(NotificationTable).values(data);
};