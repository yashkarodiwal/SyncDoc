import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
    documentId: string;
}

export default function DocumentTitle({ documentId }: Props) {

    const [title, setTitle] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {

        const loadTitle = async () => {

            const res = await axios.get(
                `https://syncdoc.onrender.com/api/documents/${documentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTitle(res.data.title);

        };

        loadTitle();

    }, [documentId]);


    const updateTitle = async () => {

        try {

            await axios.put(
                `https://syncdoc.onrender.com/api/documents/${documentId}/title`,
                { title },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

        } catch (error) {

            console.error("Title update failed");

        }

    };


    return (

        <input
            className="text-xl font-semibold border-b p-2 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={updateTitle}
        />

    );

}
