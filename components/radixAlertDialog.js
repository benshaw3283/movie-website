import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from "../styles/radixAlertDialog.module.css";

const AlertDialogDeleteReview = (props) => (
  <AlertDialog.Root {...props}>
    <AlertDialog.Trigger asChild></AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className={styles.AlertDialogOverlay} />
      <AlertDialog.Content className={styles.AlertDialogContent}>
        <AlertDialog.Title className={styles.AlertDialogTitle}>
          Are you sure?
        </AlertDialog.Title>
        <AlertDialog.Description className={styles.AlertDialogDescription}>
          This action cannot be undone. This will permanently delete your
          review.
        </AlertDialog.Description>
        <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
          <AlertDialog.Cancel asChild>
            <button
              type="button"
              className="bg-slate-700 border-2 border-slate-800 rounded py-0.5 px-0.5"
            >
              Cancel
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button className="bg-slate-700 border-2 border-slate-800 rounded py-0.5 px-0.5">
              Yes, delete review
            </button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

const AlertDialogDeleteComment = (props) => (
  <AlertDialog.Root {...props}>
    <AlertDialog.Trigger asChild>
      <p className="text-slate-200 cursor-pointer">x</p>
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className={styles.AlertDialogOverlay2} />
      <AlertDialog.Content className={styles.AlertDialogContent2}>
        <AlertDialog.Title className={styles.AlertDialogTitle2}>
          Delete Comment?
        </AlertDialog.Title>

        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
          <AlertDialog.Cancel asChild>
            <button
              type="button"
              className="bg-slate-700 border-2 border-slate-800 rounded py-0.5 px-0.5 h-6 text-sm "
            >
              Cancel
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild onClick={props.deleteComment}>
            <button className="bg-slate-700 border-2 border-slate-800 rounded py-0.5 px-0.5 h-6 text-sm ">
              Delete
            </button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default AlertDialogDeleteReview;
export { AlertDialogDeleteComment };
