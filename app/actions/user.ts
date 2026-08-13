"use server"

import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/user/user";
import { validateDisplayName, validateUsername } from "@/lib/user/validation";
import type { Locale } from "@/i18n/config";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";


type UpdateProfileProps = {
  username: string,
  displayName: string,
  description: string,
  bio: string,
  avatar?: string,
}

export async function updateProfile({ username, displayName, description, bio, avatar, }: UpdateProfileProps) {
  try {
    const user = await getCurrentDbUser()

    if (!user) {
      throw new Error("Unauthorized");
    }


    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username,
        displayName,
        description,
        bio,
        avatar,
      },
      include: {
        links: true,
      },
    });

    return {
      success: true,
      user: updatedUser,
    }
  } catch (error) {
    console.error("Update profile error:", error)

    return {
      success: false,
    }
  }

}

export async function dismissPostHistoryInfo() {
  const user = await getCurrentDbUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      postHistoryInfoDismissed: true,
    },
  });

  return {
    success: true,
  };
}


type AddProfileLinkProps = {
  title?: string;
  url: string;
};

export async function addProfileLink({
  title,
  url,
}: AddProfileLinkProps) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const lastLink = await prisma.userLink.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        order: "desc",
      },
    });

    const link = await prisma.userLink.create({
      data: {
        userId: user.id,
        title,
        url,
        order: (lastLink?.order ?? -1) + 1,
      },
    });

    revalidatePath("/my-space");

    return {
      success: true,
      link,
    };

  } catch (error) {
    console.error("Add profile link error:", error);

    return {
      success: false,
      message: "Failed to add link.",
    };
  }
}

export async function removeProfileLink(id: string) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const result = await prisma.userLink.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Link not found",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to remove profile link:", error);

    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

export async function CompleteOnboarding() {
  const user = await getCurrentDbUser();

  if (!user) {
      throw new Error("Unauthorized");
    }

  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onboardingCompleted: true,
    },
  })
}

export async function checkUsernameAvailability(username: string) {
  const currentUser = await getCurrentDbUser();

  const existingUser = await prisma.user.findFirst({
    where: {
      username,
      id: {
        not: currentUser.id,
      },
    },
  });

  const similarUsers = await prisma.user.findMany({
    where: {
      username: {
        startsWith: username,
      },
      id: {
        not: currentUser.id,
      }
    },
    select: {
      username: true,
    }
  });

  const takenUsernames = new Set(
    similarUsers.map((user) => user.username)
  );

  const suggestions: string[] = [];

  let number = 1;

  while (suggestions.length < 3) {
    const candidate = `${username}${number}`;
    if (!takenUsernames.has(candidate)) {
      suggestions.push(candidate);
    }

    number++;
  }

  if (!existingUser) {
    return {
      available: true,
      suggestions: [],
    };
  }

  return {
    available: false,
    suggestions,
  };
}

type CompleteOnboardingProps = {
  displayName: string,
  username: string,
}

type CompleteOnboardingResult = {
  success: boolean;
  field?: "displayName" | "username";
  message?: string;
};

export async function completeWelcomeModal({ displayName, username }: CompleteOnboardingProps): Promise<CompleteOnboardingResult> {
  const displayNameError = validateDisplayName(displayName);

  if (displayNameError) {
    return {
      success: false,
      field: "displayName",
      message: displayNameError,
    };
  }

  const usernameError = validateUsername(username);

  if (usernameError) {
    return {
      success: false,
      field: "username",
      message: usernameError,
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    return {
      success: false,
      field: "username",
      message: "This username is already taken.",
    };
  }

  const user = await getCurrentDbUser();

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      displayName,
      username,
    },
  });
  return {
    success: true,
  };
}

type UpdatePreferredLanguageProps = {
  locale: Locale,
}

export async function updatePreferredLanguage({ locale }: UpdatePreferredLanguageProps) {
  try {
    const user = await getCurrentDbUser()

    if (!user) {
      throw new Error("Unauthorized");
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        preferredLanguage: locale,
      },
    })

    const cookieStore = await cookies()
    cookieStore.set("locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update preferred language error:", error);

    return {
      success: false,
    };
  }
}