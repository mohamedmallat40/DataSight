import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";

interface UserCardProps {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinDate: string;
  country: string;
  countryCode: string;
  compact?: boolean;
  onClick?: (userId: string) => void;
}

export function UserCard({
  id,
  name,
  email,
  avatar,
  role,
  joinDate,
  country,
  countryCode,
  compact = false,
  onClick,
}: UserCardProps) {
  const handleClick = () => {
    onClick?.(id);
  };

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 p-2 hover:bg-content2 rounded-lg cursor-pointer transition-colors"
        onClick={handleClick}
      >
        <Avatar src={avatar} name={name} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{name}</p>
          <p className="text-xs text-default-500 truncate">{role}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-default-500">{countryCode}</p>
        </div>
      </div>
    );
  }

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      isPressable
      onPress={handleClick}
    >
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <Avatar src={avatar} name={name} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground truncate">{name}</h4>
              <Chip size="sm" color="primary" variant="flat">
                {role}
              </Chip>
            </div>
            <p className="text-sm text-default-500 truncate mb-2">{email}</p>
            <div className="flex items-center gap-4 text-xs text-default-400">
              <div className="flex items-center gap-1">
                <Icon icon="solar:calendar-linear" width={12} />
                <span>Joined {new Date(joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="solar:global-linear" width={12} />
                <span>{country}</span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
