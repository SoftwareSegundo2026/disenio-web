export default async function ForID({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return(
        <div>
            Estamos en uno
            <p>Id recibido: {id}</p>
        </div>
    );
}
