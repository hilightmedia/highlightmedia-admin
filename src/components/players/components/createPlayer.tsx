"use client";

import { FilePen, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "../../common/dialog";
import Button from "../../common/button";
import GradientIconContainer from "../../common/gradientIconContainer";
import { Input } from "../../common/input";
import { isEmpty } from "lodash";
import Select from "../../common/select";

// Adjust to your actual Player type if different
export type PlayerEntity = {
  id: number;
  name: string;
  location: string;
  playlistId: number | null;
  deviceKey?: string; // optional because you may not return it from backend list
};

type Props = {
  open: boolean;
  onClose: () => void;
  player?: PlayerEntity | null;
};

type FormData = {
  name: string;
  location: string;
  playlistId: number | null;
  deviceKey: string;
};

export default function CreatePlayer({ open, onClose, player }: Props) {
  const queryClient = useQueryClient();

  const [activePlayer, setActivePlayer] = useState<PlayerEntity | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    location: "",
    playlistId: null,
    deviceKey: "",
  });

  useEffect(() => {
    if (open) setActivePlayer(player ?? null);
  }, [open, player]);

  const isEdit = Boolean(activePlayer?.id);

  useEffect(() => {
    if (!open) return;

    setFormData({
      name: activePlayer?.name ?? "",
      location: activePlayer?.location ?? "",
      playlistId:
        typeof activePlayer?.playlistId === "number"
          ? activePlayer.playlistId
          : null,
      deviceKey: "",
    });
  }, [open, activePlayer]);

  const payload = useMemo(() => {
    return {
      name: formData.name,
      location: formData.location,
      playlistId: formData.playlistId ?? null,
      deviceKey: formData.deviceKey,
      playerId: activePlayer?.id,
    };
  }, [formData, activePlayer?.id]);

  const onSuccess = () => {
    // keep it simple & consistent: refetch list
    queryClient.invalidateQueries({ queryKey: ["players"] });
    onClose();
  };

  const { data: playlist } = useQuery({
    queryKey: ["playlist"],
    queryFn: () =>
      axiosInstance.get("/playlist/list").then((res) => res.data.playlist),
  });
  const options = !isEmpty(playlist)
    ? playlist?.map((item: { id: number; name: string }) => ({
        label: item.name,
        value: item.id,
      }))
    : [];

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance.post(isEdit ? "/players/edit" : "/players", payload),
    onSuccess: () => onSuccess(),
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name?.trim()) return alert("Please enter a name");
    if (!formData.location?.trim()) return alert("Please enter a location");

    if (formData.playlistId == null) return alert("Please select a playlist");

    const dk = (formData.deviceKey ?? "").trim();
    if (dk.length < 8 || dk.length > 16)
      return alert("Device key must be 8 to 16 characters");

    mutate();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-[500px] w-[90%] rounded-xl p-6 gap-3 bg-white">
        <DialogHeader className="flex flex-col gap-3">
          <GradientIconContainer>
            <FilePen />
          </GradientIconContainer>

          <DialogTitle className="text-left">
            {isEdit ? "Edit Player" : "Create Player"}
            <DialogDescription className="mt-2 font-normal">
              {isEdit ? "Edit your player" : "Create a new player"}
            </DialogDescription>
          </DialogTitle>

          <button
            onClick={onClose}
            className="absolute top-5 right-5"
            type="button"
          >
            <X />
          </button>
        </DialogHeader>

        <form className="flex flex-col gap-5 w-full" onSubmit={submit}>
          <div className="inline-flex flex-col gap-2">
            <label className="font-medium text-sm">Player Name</label>
            <Input
              type="text"
              placeholder="Enter player name"
              className="w-full"
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name: e.target.value }))
              }
            />
          </div>

          <div className="inline-flex flex-col gap-2">
            <label className="font-medium text-sm">Location</label>
            <Input
              type="text"
              placeholder="Enter location"
              className="w-full"
              value={formData.location}
              onChange={(e) =>
                setFormData((p) => ({ ...p, location: e.target.value }))
              }
            />
          </div>

          <div className="inline-flex flex-col gap-2">
            <label className="font-medium text-sm">Playlist</label>

            <Select
              options={options}
              value={formData.playlistId ?? ""}
              onChange={(value: any) =>
                setFormData((p) => ({ ...p, playlistId: value }))
              }
              className="px-5 py-0.5"
              iconClassName="w-3 right-3"
            />
          </div>

          <div className="inline-flex flex-col gap-2">
            <label className="font-medium text-sm">Device Key</label>
            <Input
              type="text"
              minLength={8}
              maxLength={16}
              placeholder="Enter device key (8-16 chars)"
              className="w-full"
              value={formData.deviceKey}
              onChange={(e) =>
                setFormData((p) => ({ ...p, deviceKey: e.target.value }))
              }
            />
            {isEdit ? (
              <p className="text-xs text-gray-500">
                For security, device key may not be shown. Re-enter to update.
              </p>
            ) : null}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="w-full max-w-[400px] rounded-lg bg-white border-primary border text-black"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={isPending}
              className="w-full max-w-[400px] rounded-lg"
            >
              {isEdit ? "Edit Player" : "Create Player"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
