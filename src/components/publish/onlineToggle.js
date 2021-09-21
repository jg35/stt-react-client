import { useState } from "react";
import {
  Title,
  Text,
  Button,
  Grid,
  BookPrivacyStatus,
} from "~/components/_styled";
import Modal from "~/components/modal";
import { UPDATE_USER } from "~/lib/gql";
import { useMutation } from "@apollo/client";
import { getHTMLTranslation } from "~/lib/util";

export default function OnlineToggle({ isOnline, userId, isPublic }) {
  const [updateUser, { data, loading }] = useMutation(UPDATE_USER);
  const [initModal, setInitModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function proceed() {
    updateUser({
      variables: {
        userId,
        data: {
          bookOnline: !isOnline,
        },
      },
    }).then(() => {
      closeHandler();
    });
  }

  function closeHandler() {
    const ANIMATE_CLOSE_TIME = 200;
    setIsOpen(false);
    setTimeout(() => {
      setInitModal(false);
    }, ANIMATE_CLOSE_TIME);
  }

  return (
    <>
      <div className="flex justify-end w-24">
        <span className="font-medium mr-2">
          {isOnline ? "Online" : "Offline"}
        </span>
        <div class="relative inline-block w-10 mr-2 align-middle select-none ">
          <input
            type="checkbox"
            title="Change online status"
            onChange={() => {
              setInitModal(true);
              setIsOpen(true);
            }}
            checked={isOnline}
            name="toggle"
            id="toggle"
            class="toggle-checkbox absolute block w-6 h-6 border-2 border-red rounded-full bg-white appearance-none cursor-pointer transition-all duration-500 linear"
          />
          <label
            for="toggle"
            class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-all duration-500 linear"
          ></label>
        </div>
      </div>
      {initModal && (
        <Modal size="sm" isOpen={isOpen} close={closeHandler}>
          <div className="h-auto bg-white flex flex-col mb-12">
            {isOnline ? (
              <Text css="mb-0 text-center">
                {getHTMLTranslation(
                  "components.publish.onlineToggle.offline.description"
                )}
              </Text>
            ) : (
              <BookPrivacyStatus
                prefix="Your book is"
                isPublic={isPublic}
                describe
              />
            )}
          </div>
          <Grid colSpan={["col-span-12 md:col-span-6"]}>
            <Button variant="minimal" css="w-full" onClick={closeHandler}>
              Cancel
            </Button>
            <Button
              variant="cta"
              css="w-full"
              onClick={proceed}
              inProgress={loading}
            >
              {isOnline
                ? loading
                  ? "Going offline..."
                  : "Take my book offline"
                : loading
                ? "Going online..."
                : "Put my book online"}
            </Button>
          </Grid>
        </Modal>
      )}
    </>
  );
}
