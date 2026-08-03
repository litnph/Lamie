import React from 'react';
import { AccountSidebar } from '../components/layout/AccountSidebar';
import { LeafIcon } from '../components/common/Icons';
import { Card } from '../components/ui/Card';
import { FadeIn } from '../components/ui/FadeIn';
import { SectionWrapper } from '../components/ui/SectionWrapper';

interface MemberOrder {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing';
  items: string;
  total: string;
}

interface MemberPageProps {
  onLogout: () => void;
  orders?: MemberOrder[];
  isLoading?: boolean;
  error?: string | null;
}

const MOCK_ORDERS: MemberOrder[] = [
  { id: '#L9081', date: 'Oct 24, 2024', status: 'Delivered', items: 'Vintage Rose Bouquet', total: '650.000₫' },
  { id: '#L9112', date: 'Nov 02, 2024', status: 'Processing', items: 'Morning Dew (x2)', total: '900.000₫' },
];

const metrics = [
  { label: 'Total orders', value: '12', detail: 'Since joining' },
  { label: 'Wishlist', value: '5', detail: 'Saved arrangements' },
  { label: 'Reward points', value: '450', detail: 'Available balance' },
];

const statusStyles: Record<MemberOrder['status'], string> = {
  Delivered: 'bg-[var(--color-success-bg)] text-[var(--color-success-text)]',
  Processing: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]',
};

const DashboardSkeleton: React.FC = () => (
  <div aria-label="Loading account dashboard" role="status" className="animate-pulse space-y-10">
    <span className="sr-only">Loading account dashboard</span>
    <div aria-hidden="true" className="space-y-3">
      <div className="h-10 w-52 rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)]" />
      <div className="h-5 w-full max-w-xl rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)]" />
    </div>
    <div aria-hidden="true" className="grid overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] sm:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="space-y-3 border-b border-[var(--color-border-subtle)] p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
          <div className="h-4 w-24 rounded bg-[var(--color-surface-subtle)]" />
          <div className="h-9 w-16 rounded bg-[var(--color-surface-subtle)]" />
        </div>
      ))}
    </div>
    <div aria-hidden="true" className="space-y-3">
      {[0, 1, 2].map((item) => <div key={item} className="h-16 rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)]" />)}
    </div>
  </div>
);

const EmptyOrders: React.FC = () => (
  <Card surface="subtle" padding="lg" className="text-center">
    <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface)] text-[var(--color-text-accent)]" aria-hidden="true">
      <LeafIcon className="h-6 w-6" />
    </div>
    <h3 className="font-serif text-2xl text-[var(--color-text-primary)]">No orders yet</h3>
    <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-text-muted)]">Your orders will appear here after you choose your first arrangement.</p>
  </Card>
);

const OrderStatus: React.FC<{ status: MemberOrder['status'] }> = ({ status }) => (
  <span className={`inline-flex min-h-7 items-center rounded-[var(--radius-pill)] px-3 text-xs font-medium ${statusStyles[status]}`}>
    {status}
  </span>
);

const DashboardError: React.FC<{ message: string }> = ({ message }) => (
  <Card surface="outlined" padding="lg" role="alert" className="border-[var(--color-danger-text)]">
    <h2 className="font-serif text-2xl text-[var(--color-text-primary)]">Account details unavailable</h2>
    <p className="mt-2 max-w-xl text-sm text-[var(--color-text-secondary)]">{message}</p>
  </Card>
);

const Orders: React.FC<{ orders: MemberOrder[] }> = ({ orders }) => {
  if (orders.length === 0) return <EmptyOrders />;

  return (
    <>
      <div className="space-y-3 xl:hidden">
        {orders.map((order) => (
          <Card key={order.id} surface="outlined" padding="md" className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="lamie-tabular text-sm font-semibold text-[var(--color-text-primary)]">{order.id}</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{order.date}</p>
              </div>
              <OrderStatus status={order.status} />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">{order.items}</p>
              <p className="lamie-tabular mt-1 font-medium text-[var(--color-text-primary)]">{order.total}</p>
            </div>
            <button type="button" className="min-h-11 text-sm font-medium text-[var(--color-text-primary)] underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--color-text-accent)]">
              View order
            </button>
          </Card>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] xl:block">
        <table className="w-full table-fixed text-left text-sm">
          <caption className="sr-only">Recent orders</caption>
          <thead className="bg-[var(--color-surface-subtle)] text-xs text-[var(--color-text-muted)]">
            <tr>
              <th scope="col" className="w-[16%] px-5 py-4 font-medium">Order</th>
              <th scope="col" className="w-[18%] px-5 py-4 font-medium">Date</th>
              <th scope="col" className="w-[27%] px-5 py-4 font-medium">Arrangement</th>
              <th scope="col" className="w-[17%] px-5 py-4 font-medium">Status</th>
              <th scope="col" className="w-[14%] px-5 py-4 text-right font-medium">Total</th>
              <th scope="col" className="w-[8%] px-5 py-4"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-canvas)]">
                <th scope="row" className="lamie-tabular px-5 py-5 font-semibold text-[var(--color-text-primary)]">{order.id}</th>
                <td className="px-5 py-5 text-[var(--color-text-muted)]">{order.date}</td>
                <td className="truncate px-5 py-5 text-[var(--color-text-secondary)]" title={order.items}>{order.items}</td>
                <td className="px-5 py-5"><OrderStatus status={order.status} /></td>
                <td className="lamie-tabular px-5 py-5 text-right font-medium text-[var(--color-text-primary)]">{order.total}</td>
                <td className="px-5 py-5 text-right">
                  <button type="button" aria-label={`View order ${order.id}`} className="min-h-11 rounded-[var(--radius-sm)] px-2 text-sm font-medium text-[var(--color-text-primary)] underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--color-text-accent)]">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const MemberPage: React.FC<MemberPageProps> = ({ onLogout, orders = MOCK_ORDERS, isLoading = false, error = null }) => (
  <div className="min-h-screen bg-[var(--color-canvas)] pb-20 pt-32">
    <SectionWrapper className="lamie-section-space--compact" noPadding>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-[var(--space-grid)]">
        <AccountSidebar onLogout={onLogout} />

        <div className="min-w-0 lg:col-span-9" aria-busy={isLoading}>
          {isLoading ? (
            <DashboardSkeleton />
          ) : error ? (
            <DashboardError message={error} />
          ) : (
            <FadeIn>
              <header className="mb-10 border-b border-[var(--color-border-subtle)] pb-8">
                <h1 className="font-serif text-4xl leading-tight text-[var(--color-text-primary)] sm:text-5xl">Welcome back, Sophie</h1>
                <p className="mt-4 max-w-2xl text-[var(--color-text-secondary)]">Review recent orders, saved arrangements, delivery addresses, and account details.</p>
              </header>

              <dl className="mb-12 grid overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="border-b border-[var(--color-border-subtle)] p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                    <dt className="text-sm text-[var(--color-text-muted)]">{metric.label}</dt>
                    <dd className="lamie-tabular mt-2 font-serif text-4xl leading-none text-[var(--color-text-primary)]">{metric.value}</dd>
                    <p className="mt-3 text-xs text-[var(--color-text-muted)]">{metric.detail}</p>
                  </div>
                ))}
              </dl>

              <section aria-labelledby="recent-orders-heading">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <h2 id="recent-orders-heading" className="font-serif text-2xl text-[var(--color-text-primary)] sm:text-3xl">Recent orders</h2>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">Your latest Lamie purchases and their current status.</p>
                  </div>
                  {orders.length > 0 ? <span className="lamie-tabular shrink-0 text-sm text-[var(--color-text-muted)]">{orders.length} shown</span> : null}
                </div>
                <Orders orders={orders} />
              </section>
            </FadeIn>
          )}
        </div>
      </div>
    </SectionWrapper>
  </div>
);
