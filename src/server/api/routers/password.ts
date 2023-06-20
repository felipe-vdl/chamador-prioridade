import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import type { CurrentCommonPassword } from "@prisma/client";

type PasswordInfo = Pick<CurrentCommonPassword, "password" | "message">;

const passwordEmitter = new EventEmitter();

export const passwordRouter = createTRPCRouter({
  commonSubscription: publicProcedure.subscription(() => {
    return observable<PasswordInfo>((emit) => {
      const onCallPassword = (password: PasswordInfo) => {
        emit.next(password);
      };

      const onResetPasswords = () => {
        emit.next({ password: 0, message: "" });
      };

      passwordEmitter.on("call-common-password", onCallPassword);
      passwordEmitter.on("reset-common", onResetPasswords);

      return () => {
        passwordEmitter.off("call-common-password", onCallPassword);
        passwordEmitter.off("reset-common", onResetPasswords);
      };
    });
  }),
  prioritySubscription: publicProcedure.subscription(() => {
    return observable<PasswordInfo>((emit) => {
      const onCallPassword = (password: PasswordInfo) => {
        emit.next(password);
      };

      const onResetPasswords = () => {
        emit.next({ password: 0, message: "" });
      };

      passwordEmitter.on("call-priority-password", onCallPassword);
      passwordEmitter.on("reset-priority", onResetPasswords);

      return () => {
        passwordEmitter.off("call-priority-password", onCallPassword);
        passwordEmitter.off("reset-priority", onResetPasswords);
      };
    });
  }),
  totalCommonSubscription: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const onTotalCommon = (count: number) => {
        emit.next(count);
      };

      passwordEmitter.on("total-common", onTotalCommon);

      return () => {
        passwordEmitter.off("total-common", onTotalCommon);
      };
    });
  }),
  totalPrioritySubscription: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const onTotalCommon = (count: number) => {
        emit.next(count);
      };

      passwordEmitter.on("total-priority", onTotalCommon);

      return () => {
        passwordEmitter.off("total-priority", onTotalCommon);
      };
    });
  }),
  newCommonPassword: publicProcedure.mutation(async ({ ctx }) => {
    const newPassword = await ctx.prisma.commonPassword.create({ data: {} });

    /* Current Session */
    await ctx.prisma.sessionCommonTotal
      .findFirst({
        orderBy: { id: "desc" },
      })
      .then(async (session) => {
        if (session) {
          return await ctx.prisma.sessionCommonTotal.update({
            where: { id: session.id },
            data: {
              quantity: { increment: 1 },
            },
          });
        }
      })
      .then((commonSession) => {
        if (commonSession) {
          passwordEmitter.emit("total-common", commonSession.quantity);
        }
      });

    return newPassword;
  }),
  newPriorityPassword: publicProcedure.mutation(async ({ ctx }) => {
    const newPassword = await ctx.prisma.priorityPassword.create({ data: {} });

    /* Current Session */
    await ctx.prisma.sessionPriorityTotal
      .findFirst({
        orderBy: { id: "desc" }
      })
      .then(async (session) => {
        if (session) {
          return await ctx.prisma.sessionPriorityTotal.update({
            where: { id: session.id },
            data: {
              quantity: { increment: 1 },
            },
          });
        }
      })
      .then((prioritySession) => {
        if (prioritySession) {
          passwordEmitter.emit("total-priority", prioritySession.quantity);
        }
      });

    return newPassword;
  }),
  currentCommonPassword: publicProcedure.query(async ({ ctx }) => {
    const currentPassword = await ctx.prisma.currentCommonPassword.findUnique({
      where: { id: 1 },
    });

    if (currentPassword) {
      return currentPassword;
    } else {
      throw new Error("A senha atual não existe na base de dados.");
    }
  }),
  currentPriorityPassword: publicProcedure.query(async ({ ctx }) => {
    const priorityPassword =
      await ctx.prisma.currentPriorityPassword.findUnique({
        where: { id: 1 },
      });

    if (priorityPassword) {
      return priorityPassword;
    } else {
      throw new Error("A senha atual não existe na base de dados.");
    }
  }),
  callCommonPassword: publicProcedure
    .input(
      z.object({
        message: z.string().optional(),
        password: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const password = await ctx.prisma.commonPassword.findUnique({
        where: { id: input.password },
      });
      if (password) {
        /* Update the Current Password */
        await ctx.prisma.currentCommonPassword.update({
          where: { id: 1 },
          data: {
            password: input.password,
            message: input.message,
          },
        });
        passwordEmitter.emit("call-common-password", {
          password: input.password,
          message: input.message,
        });
        return { password: input.password, message: input.message };
      } else {
        throw new Error("A senha não existe.");
      }
    }),
  callPriorityPassword: publicProcedure
    .input(
      z.object({
        message: z.string().optional(),
        password: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const password = await ctx.prisma.priorityPassword.findUnique({
        where: { id: input.password },
      });
      if (password) {
        /* Update the Current Password */
        await ctx.prisma.currentPriorityPassword.update({
          where: { id: 1 },
          data: {
            password: input.password,
            message: input.message,
          },
        });
        passwordEmitter.emit("call-priority-password", {
          password: input.password,
          message: input.message,
        });
        return { password: input.password, message: input.message };
      } else {
        throw new Error("A senha não existe.");
      }
    }),
  reset: publicProcedure.mutation(async ({ ctx }) => {
    /* Reset Current Password */
    await ctx.prisma.currentCommonPassword.update({
      where: { id: 1 },
      data: { password: 0, message: "" },
    });
    await ctx.prisma.currentPriorityPassword.update({
      where: { id: 1 },
      data: { password: 0, message: "" },
    });

    const previousCommonSession = await ctx.prisma.sessionCommonTotal.findFirst(
      {
        orderBy: { id: "desc" },
      }
    );
    const previousPrioritySession =
      await ctx.prisma.sessionPriorityTotal.findFirst({
        orderBy: { id: "desc" },
      });

    if (previousCommonSession && previousPrioritySession) {
      /* Close the last Sessions */
      await ctx.prisma.sessionCommonTotal.update({
        where: { id: previousCommonSession.id },
        data: {
          closedAt: new Date(),
        },
      });
      await ctx.prisma.sessionPriorityTotal.update({
        where: { id: previousPrioritySession.id },
        data: {
          closedAt: new Date(),
        },
      });
    }

    const createdAtDate = new Date();
    /* Create a New Session */
    await ctx.prisma.sessionCommonTotal.create({
      data: {
        createdAt: createdAtDate,
        quantity: 0,
        updatedAt: null,
        closedAt: null,
      },
    });
    await ctx.prisma.sessionPriorityTotal.create({
      data: {
        createdAt: createdAtDate,
        quantity: 0,
        updatedAt: null,
        closedAt: null,
      },
    });

    /* Reset Password's Queues */
    await ctx.prisma.commonPassword.deleteMany({});
    await ctx.prisma.priorityPassword.deleteMany({});
    await ctx.prisma.$queryRaw`TRUNCATE TABLE common_passwords;`;
    await ctx.prisma.$queryRaw`TRUNCATE TABLE priority_passwords;`;
    passwordEmitter.emit("reset-common");
    passwordEmitter.emit("reset-priority");
    return true;
  }),
  currentTotals: publicProcedure.query(async ({ ctx }) => {
    const [commonSession, prioritySession] = await ctx.prisma.$transaction([
      ctx.prisma.sessionCommonTotal.findFirst({
        orderBy: { id: "desc" },
      }),
      ctx.prisma.sessionPriorityTotal.findFirst({
        orderBy: { id: "desc" },
      }),
    ]);

    return {
      common: commonSession?.quantity ?? 0,
      priority: prioritySession?.quantity ?? 0,
    };
  }),
});
