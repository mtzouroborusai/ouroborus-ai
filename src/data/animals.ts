export interface Animal {
    id: number;
    name: string;
    type: 'dog' | 'cat' | 'other';
    status: 'lost' | 'found';
    location: string;
    date: string;
    image: string;
    description: string;
    contact: string;
}

export const mockAnimals: Animal[] = [
    {
        id: 1,
        name: "Rex",
        type: "dog",
        status: "lost",
        location: "Parque Central, Santiago",
        date: "2025-04-10",
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80",
        description: "Golden Retriever, collar rojo. Muy amigable.",
        contact: "+56 9 1234 5678"
    },
    {
        id: 2,
        name: "Luna",
        type: "cat",
        status: "lost",
        location: "Providencia, cerca del Metro",
        date: "2025-04-12",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80",
        description: "Gata negra, ojos verdes. Se asusta facilmente.",
        contact: "contacto@email.com"
    },
    {
        id: 3,
        name: "Bobby",
        type: "dog",
        status: "found",
        location: "La Florida",
        date: "2025-04-11",
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=500&q=80",
        description: "Encontrado cerca del mall. Sin collar.",
        contact: "Veterinaria Local"
    }
];
