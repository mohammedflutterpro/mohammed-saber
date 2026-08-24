import { getMedia, putMedia } from "../../../lib/github-media";

export async function GET(request: Request) { return getMedia(request, "photo"); }
export async function PUT(request: Request) { return putMedia(request, "photo"); }
