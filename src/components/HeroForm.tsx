import type { SubmitEvent } from "react";
import type { Hero } from "../types/hero";
import { useMessages } from "../context/MessageContext";
import { useNavigate } from "react-router-dom";

type Props = {
  hero?: Hero;
  setHero?: (hero: Hero) => void;
};

const apiURL = import.meta.env.VITE_API_URL;

export default function HeroForm({ hero, setHero }: Props) {
  const { addMessage } = useMessages();
  const navigate = useNavigate();

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const url = hero ? `${apiURL}/heroes/${hero.id}` : `${apiURL}/heroes`;
    const method = hero ? `PUT` : `POST`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.get("name") }),
      });

      if (!response.ok)
        throw new Error("Request Failed: " + response.statusText);

      const data = await response.json();
      const message = hero
        ? `Hero ${hero.name} updated to ${data.name}`
        : `Hero ${data.name} created`;
      addMessage(message);

      if (hero && setHero) {
        setHero(data);
      } else {
        navigate(`/heroes/${data.id}`);
      }
    } catch (error) {
      console.log(error);
      addMessage("Failed to updated hero");
    }
  };

  return (
    <div className="mt-3">
      <h2 className="text-2xl">{hero ? "Edit hero" : "Create hero"}</h2>
      <form onSubmit={onSubmit}>
        <label>Hero name</label>
        <div className="flex gap-3">
          <input
            type="text"
            name="name"
            placeholder="name"
            className="border border-gray-300 rounded-lg p-2 w-1/4"
            defaultValue={hero?.name ?? ""}
          />

          <button type="submit" className="btn">
            {hero ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
