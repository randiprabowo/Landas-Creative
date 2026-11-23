import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { robotsText } from '../utils/seo';
export const GET: APIRoute = () => new Response(robotsText(site), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
