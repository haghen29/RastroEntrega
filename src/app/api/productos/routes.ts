import { productoService } from "@/lib/services";

export async function GET(): Promise<Response> {
  try {
    const productos = await productoService.obtenerTodos();

    return Response.json({
      status: "ok",
      data: productos
    });
  } catch (error) {
    return Response.json(
      {
        status: "error",
        database: "unreachable",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 503 },
    );
  }
}
