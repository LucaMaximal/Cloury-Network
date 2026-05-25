import type { Request, Response, NextFunction } from "express";
import { isTeamRole } from "@workspace/db";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Nicht authentifiziert" });
    return;
  }
  next();
}

export function requireTeam(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Nicht authentifiziert" });
    return;
  }
  if (!req.session?.userRole || !isTeamRole(req.session.userRole)) {
    res.status(403).json({ error: "Keine Berechtigung" });
    return;
  }
  next();
}

export function requireOwnerOrAdmin(req: Request, res: Response, next: NextFunction): void {
  const role = req.session?.userRole;
  if (!req.session?.userId || !role) {
    res.status(401).json({ error: "Nicht authentifiziert" });
    return;
  }
  if (role !== "Owner" && role !== "Admin") {
    res.status(403).json({ error: "Keine Berechtigung" });
    return;
  }
  next();
}
