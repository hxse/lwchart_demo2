
export const initPanelSelectOptions = [
    {
        id: 1,
        name: `C`,
        panelOptions: {
            template: `a`,
            gridTemplateColumns: "1fr",
            gridTemplateRows: "1fr",
        },
        chartCount: 1
    },
    {
        id: 2,
        name: `U-D`,
        panelOptions: {
            template: `a
                       b`,
            gridTemplateColumns: "1fr",
            gridTemplateRows: "1fr 1fr",
        },
        chartCount: 2
    },
    {
        id: 3,
        name: `L-R`,
        panelOptions: {
            template: `a b`,
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr",
        },
        chartCount: 2
    },
    {
        id: 4,
        name: `LU-RU-LD-RD`,
        panelOptions: {
            template: `a b
                       c d`,
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
        },
        chartCount: 4
    },
    {
        id: 5,
        name: `L-RU-RD`,
        panelOptions: {
            template: `a b
                       a c`,
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
        },
        chartCount: 3
    },
    {
        id: 6,
        name: `R-LU-LD`,
        panelOptions: {
            template: `b a
                       c a`,
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
        },
        chartCount: 3
    },
    {
        id: 7,
        name: `U-LD-RD`,
        panelOptions: {
            template: `a a
                       b c`,
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
        },
        chartCount: 3
    },
    {
        id: 8,
        name: `D-LU-RU`,
        panelOptions: {
            template: `b c
                       a a`,
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
        },
        chartCount: 3
    },
    {
        id: 9,
        name: `LU-CU-RU-LD-CD-RD`,
        panelOptions: {
            template: `a b c
                       d e f`,
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
        },
        chartCount: 6
    },
    {
        id: 10,
        name: `LU-LC-LD-RU-RC-RD`,
        panelOptions: {
            template: `a d
                       b e
                       c f`,
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr 1fr",
        },
        chartCount: 6
    },
];
