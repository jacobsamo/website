import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/ui/timeline';
import { siteConfig } from '@/lib/config';
import { format } from 'date-fns';

export default function JobList() {
  return (
    <Timeline defaultValue={3}>
      {siteConfig.work.map((work) => (
        <TimelineItem
          key={work.id}
          step={siteConfig.work.indexOf(work) + 1}
          className="group-data-[orientation=vertical]/timeline:sm:ms-32"
        >
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate className="inline-flex gap-2 items-center group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
              {format(work.startDate, 'MMMM yyyy')} -{' '}
              {format(work.endDate, 'MMMM yyyy')}
            </TimelineDate>
            <TimelineTitle className="sm:-mt-0.5">
              {work.companyName}
            </TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent>{work.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
