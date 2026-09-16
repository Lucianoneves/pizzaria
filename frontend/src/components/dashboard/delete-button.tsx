

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteProductAction } from "@/actions/CreateProduct";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface DeleteButtonProductProps {
    productId: string;
}

export function DeleteButtonProduct({ productId }: DeleteButtonProductProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        setIsDeleting(true);

        try {
            const result = await DeleteProductAction(productId);

            if (result.success) {
                router.refresh();
            }
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Button
            type="button"
            size="icon"
            disabled={isDeleting}
            onClick={handleDelete}
            className="bg-red-500 text-white hover:bg-red-500/90"
        >
            <Trash className="h-4 w-4" />
        </Button>
    );
}

