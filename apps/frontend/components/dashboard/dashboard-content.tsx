'use client';

import { QuickActionCard } from './quick-action-card';
import { quickActions } from './quick-actions';
import { RecentActivity } from './recent-activity';
import { SystemStatus } from './system-status';
import { UserSummary } from './user-summary';

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <UserSummary />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Accesos rápidos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} action={action} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <SystemStatus />
      </div>
    </div>
  );
}
