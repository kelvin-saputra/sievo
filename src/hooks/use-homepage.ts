import { HomepageData } from "@/models/response/homepage";
import axios from "axios";
import { useCallback, useState } from "react";

const HOMEPAGE_URL = process.env.NEXT_PUBLIC_HOMEPAGE_API_URL!;
export default function useHomepage() {
    const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchHomepageData = useCallback(async () => {
        setLoading(true);
        try {
            const { data:response } = await axios.get(`${HOMEPAGE_URL}`);
            response.data.total_task = response.data._count.task;
            response.data.total_manage = response.data._count.event;
            const parsedResponse = HomepageData.parse(response.data);
            setHomepageData(parsedResponse);
        } finally {
            setLoading(false);
        }
    }, [])

    return {
        homepageData,
        loading,
        fetchHomepageData
    }
}