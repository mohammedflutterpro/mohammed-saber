import { getMedia, putMedia } from "../../../lib/github-media";

export async function GET(request: Request) { return getMedia(request, "cv"); }
export async function PUT(request: Request) { return putMedia(request, "cv"); }
