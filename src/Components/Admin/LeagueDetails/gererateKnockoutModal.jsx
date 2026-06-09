"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { API } from "../../../axios";

export default function GenerateKnockoutModal({
  isOpen,
  onClose,
  onSubmit,
  registeredPlayers,
}) {
  const [selected, setSelected] = useState(new Set());
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  const { data: { data: { data } = {} } = {}, isLoading } = useQuery({
    queryKey: ["players"],
    queryFn: () => {
      return API.get("/users/getAllUsers", {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  useEffect(() => {
    const unregisteredPlayers = data
      ? data.filter((player) => !registeredPlayers?.includes(player._id))
      : [];
    setFilteredPlayers(unregisteredPlayers);
  }, [data, registeredPlayers]);

  const handleToggle = (player) => {
    const newSelected = new Set(selected);
    if (newSelected.has(player)) {
      newSelected.delete(player);
    } else if (newSelected.size < 4) {
      newSelected.add(player);
    }
    setSelected(newSelected);
  };

  const handleSubmit = () => {
    if (selected.size === 4) {
      onSubmit(Array.from(selected));
      setSelected(new Set());
    }
  };

  const handleClose = () => {
    setSelected(new Set());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-11/12 max-h-80vh flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold m-0 mb-2 text-gray-900">
            Generate Knockout Stage
          </h2>
          <p className="text-sm text-gray-500 m-0">
            Choose top 4 players from previous league
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {filteredPlayers?.map((player) => (
            <div key={player?._id} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={player?._id}
                checked={selected.has(player?._id)}
                onChange={() => handleToggle(player?._id)}
                disabled={selected.size === 4 && !selected.has(player?._id)}
                className="w-4 h-4 cursor-pointer accent-blue-500"
              />
              <label
                htmlFor={player?._id}
                className="text-sm font-medium cursor-pointer text-gray-900 flex-1"
              >
                {player?.name} ({player?._id})
              </label>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selected.size !== 4}
            className={`px-4 py-2 text-sm font-medium bg-blue-500 text-white border-none rounded-md transition-colors ${
              selected.size !== 4
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-blue-600"
            }`}
          >
            Genereate ({selected.size}/4)
          </button>
        </div>
      </div>
    </div>
  );
}
