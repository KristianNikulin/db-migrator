import { useEffect, useState } from "react";

import { getTables } from "../../api";
import { transformData } from "./utils";

export const useMigrationState = () => {
    const [database, setDatabase] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const tables = await getTables();
            const result = tables?.result || null;
            if (result) {
                const transformedData = await transformData(result);
                setDatabase(transformedData);
            }
        };

        setTimeout(() => {
            fetchData();
        }, 2400); // убрать
    }, []);

    return {
        database,
    };
};
