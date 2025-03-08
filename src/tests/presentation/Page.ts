import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { sleep } from "../utils";

async function visit(name: RegExp) {
    const link = screen.getByRole("link", {
        name,
    });
    await userEvent.click(link);
    await sleep(100);
}

async function visitSearch() {
    await visit(/Rechercher des podcasts/i)
}

export {
    visit,
    visitSearch
}