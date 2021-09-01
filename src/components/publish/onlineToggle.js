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

export default function OnlineToggle({ isOnline, userId, isPublic }) {
  const [updateUser, { data, loading }] = useMutation(UPDATE_USER);
  const [showModal, setShowModal] = useState(false);

  function proceed() {
    updateUser({
      variables: {
        userId,
        data: {
          bookOnline: !isOnline,
        },
      },
    }).then(() => {
      setShowModal(false);
    });
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
            onChange={() => setShowModal(true)}
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
      <Modal size="sm" isOpen={showModal} close={() => setShowModal(false)}>
        <Title css="mb-6 text-center" size="large">
          {isOnline ? "Take book offline..." : "Put book online..."}
        </Title>
        <div className="py-6 px-3 h-auto bg-white flex flex-col  mb-12">
          {isOnline ? (
            <Text css="mb-0 text-center">
              While your book is offline, readers will no longer have access to
              your book.
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
          <Button
            variant="minimal"
            css="w-full"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
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
    </>
  );
}
