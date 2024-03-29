"use client";

import {useMemo} from "react";
import {useRouter} from "next/navigation";
import {v4 as uuidv4} from "uuid";

import {Button, Card, Text, TextField} from "@radix-ui/themes";
import {MagicWandIcon} from "@radix-ui/react-icons";
import {getSocket} from "@/src/utils/socket";

export default function RaffleJoin({params}) {
    const router = useRouter();
    const socket = useMemo(() => getSocket(), []);

    const userId = useMemo(() => {
        if (typeof localStorage === 'undefined') return
        const cachedUserId = localStorage.getItem("userId");

        if (cachedUserId) {
            return cachedUserId;
        }

        const newUserId = uuidv4();

        localStorage.setItem("userId", newUserId);
        return newUserId;
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const name = formData.get("name");
        const {raffleId} = params;

        socket.emit("join_raffle", {name, raffleId, userId});

        router.push(`/raffle/${raffleId}/result`);
    };

    return (
        <form
            className="flex min-h-screen flex-col items-center gap-8 justify-center p-12"
            onSubmit={handleSubmit}
        >
            <Card className="max-w-full w-96">
                <div className="flex flex-col justify-stretch items-stretch gap-8">
                    <Text as="label" size="2" className="flex flex-col gap-4">
                        Your name
                        <TextField.Input
                            variant="soft"
                            placeholder="Name"
                            size="3"
                            required
                            autoFocus
                            name="name"
                        />
                    </Text>

                    <Button type="submit" size="4">
                        <MagicWandIcon width="16" height="16"/> Join
                    </Button>
                </div>
            </Card>
        </form>
    );
}
