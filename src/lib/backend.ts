export type BackendResponse<T> =
  | {
      success: boolean;
      timestamp: string;
      data: T;
      message?: string;
    }
  | {
      success: false;
      timestamp: string;
      message: string;
      data: T;
      errors?: { [key: string]: string };
    };

export async function myFetch<T>(input: RequestInfo | URL, init?: RequestInit) {
  try {
    const res = await fetch(input, init);

    const resJson: BackendResponse<T> = await res.json();

    if (!resJson.success) {
      const errors = "errors" in resJson ? resJson.errors : undefined;
      const errorsValues = errors ? Object.values(errors).join(", ") : "";
      throw new Error(resJson.message + (errors ? ": " + errorsValues : ""));
    }

    return resJson.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Errore generico");
  }
}
