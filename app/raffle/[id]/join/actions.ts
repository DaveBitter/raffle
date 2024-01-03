"use server";

import { redirect } from "next/navigation";
async function join(FormData) {
  const name = FormData.get("name");
  const id = FormData.get("id");

  redirect(`/raffle/${id}/result`);
}

export { join };
