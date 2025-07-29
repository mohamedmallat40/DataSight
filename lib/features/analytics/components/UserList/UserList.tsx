"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Avatar, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface User {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface UserListProps {
  users: User[];
  country: string;
}

export const UserList = ({ users, country }: UserListProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="fixed top-20 right-4 z-[1000] pointer-events-none"
  >
    <Card className="w-80 shadow-lg border-1 border-primary/20 bg-content1/95 backdrop-blur-sm">
      <CardBody className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon
            icon="solar:users-group-rounded-linear"
            className="text-primary"
            width={20}
          />
          <h4 className="font-semibold text-foreground">{country}</h4>
          <Chip size="sm" color="primary" variant="flat">
            {users.length} users
          </Chip>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {users.slice(0, 10).map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 rounded-md bg-default-50"
            >
              <Avatar src={user.avatar} alt={user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-default-500 truncate">
                  {user.email}
                </p>
              </div>
              {user.role && (
                <Chip
                  size="sm"
                  variant="flat"
                  color="secondary"
                  className="text-xs"
                >
                  {user.role}
                </Chip>
              )}
            </div>
          ))}
          {users.length > 10 && (
            <p className="text-xs text-default-500 text-center py-2">
              +{users.length - 10} more users
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  </motion.div>
);
