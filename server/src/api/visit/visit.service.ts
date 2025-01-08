import {
  AddVisitRequestDto,
  MoveVisitRequestDto,
  Visit,
} from "@medicup/shared";
import { Database } from "../../database/database";

export class VisitService {
  static async getVisitsForPatient(patientId: number): Promise<Visit[]> {
    const db = Database.getInstance();
    const visitsWithData = await db
      .selectFrom("visit")
      .innerJoin("doctor", "doctor.id", "visit.doctorId")
      .innerJoin("patient", "patient.id", "visit.patientId")
      .selectAll("visit")
      .select([
        "doctor.firstName as doctorFirstName",
        "doctor.lastName as doctorLastName",
      ])
      .select([
        "patient.firstName as patientFirstName",
        "patient.lastName as patientLastName",
      ])
      .where("patientId", "=", patientId)
      .execute();

    const visits = visitsWithData.map((visit) => {
      return {
        ...visit,
        doctor: {
          id: visit.doctorId,
          firstName: visit.doctorFirstName,
          lastName: visit.doctorLastName,
        },
        patient: {
          id: visit.patientId,
          firstName: visit.patientFirstName,
          lastName: visit.patientLastName,
        },
      };
    });

    return visits;
  }

  static async addVisit(dto: AddVisitRequestDto): Promise<Visit> {
    const db = Database.getInstance();
    const patient = await db
      .selectFrom("patient")
      .where("id", "=", dto.patientId)
      .selectAll()
      .executeTakeFirstOrThrow();
    const doctor = await db
      .selectFrom("doctor")
      .where("id", "=", dto.doctorId)
      .selectAll()
      .executeTakeFirstOrThrow();

    const newVisit = await db
      .insertInto("visit")
      .values({
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        startAt: dto.startAt,
        endAt: dto.endAt,
        patientNote: dto.patientNote,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return {
      ...newVisit,
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
      },
      doctor: {
        id: doctor.id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
      },
    };
  }

  static async cancelVisit(visitId: number): Promise<Visit> {
    const db = Database.getInstance();
    const visit = await db
      .updateTable("visit")
      .set({ cancelledAt: new Date() })
      .where("id", "=", visitId)
      .returningAll()
      .executeTakeFirstOrThrow();

    const patient = await db
      .selectFrom("patient")
      .where("id", "=", visit.patientId)
      .selectAll()
      .executeTakeFirstOrThrow();
    const doctor = await db
      .selectFrom("doctor")
      .where("id", "=", visit.doctorId)
      .selectAll()
      .executeTakeFirstOrThrow();

    return {
      ...visit,
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
      },
      doctor: {
        id: doctor.id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
      },
    };
  }

  static async moveVisit(dto: MoveVisitRequestDto): Promise<Visit> {
    const db = Database.getInstance();

    const visit = await db
      .updateTable("visit")
      .set({ startAt: new Date(dto.startAt), endAt: new Date(dto.endAt) })
      .where("id", "=", dto.visitId)
      .returningAll()
      .executeTakeFirstOrThrow();

    const patient = await db
      .selectFrom("patient")
      .where("id", "=", visit.patientId)
      .selectAll()
      .executeTakeFirstOrThrow();

    const doctor = await db
      .selectFrom("doctor")
      .where("id", "=", visit.doctorId)
      .selectAll()
      .executeTakeFirstOrThrow();

    return {
      ...visit,
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
      },
      doctor: {
        id: doctor.id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
      },
    };
  }
}
