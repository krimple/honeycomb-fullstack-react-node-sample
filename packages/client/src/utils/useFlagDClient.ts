import {useState} from "react";
import {client} from "./feature-flags/flagdClient.ts";
import type {Client} from "@openfeature/web-sdk";

export function useFlagD() {
    const [flagDClient] = useState<Client>(client);
    return flagDClient;
}
