// Content loader utility for Markdown files
// This allows dynamic loading of content from MD files for better maintainability

export const loadServiceContent = async (serviceName) => {
  try {
    // In a real application, you would parse MD files
    // For now, we'll return structured content objects
    
    const contentMap = {
      'strategic-project-acceleration': {
        title: 'Accelerating Strategic Tech Initiatives for Impactful Outcomes',
        description: 'Successful execution of strategic tech initiatives is key to business growth. At ElevateIdea, we drive momentum by aligning teams, optimizing execution, and ensuring timely delivery of high-impact projects. Our expertise in project acceleration transforms roadblocks into opportunities, keeping your initiatives on track and delivering results that fuel innovation and long-term success.',
        frameworkOverview: 'This framework outlines a structured, step-by-step approach to reviving struggling technology projects. It covers identifying root causes of project delays and misalignment, strategic realignment of project goals and team dynamics, creating customized recovery plans, and executing recovery initiatives to ensure smooth project turnaround with expected business outcomes.',
        phases: [
          {
            icon: '🔍',
            title: 'Root Cause Analysis',
            description: 'Identify the root causes of project delays, underperformance, and misalignment.',
            requirements: [
              'Access to key project documentation (timelines, budgets, milestones)',
              'Availability of stakeholders and project team members for interviews',
              'Existing project plans, schedules, and timelines'
            ],
            deliverables: [
              'Project Review: Existing project plans, schedules, and timelines',
              'Data collection: Project documentation, performance data, stakeholder feedback',
              'Root cause analysis of delays, communication breakdowns, and performance issues',
              'Detailed diagnosis of project issues and actionable insights'
            ]
          },
          {
            icon: '🎯',
            title: 'Strategic Realignment',
            description: 'Re-align project goals, stakeholders, and team dynamics for collaboration and shared vision.',
            requirements: [
              'Clear commitment to re-align project goals and responsibilities',
              'Revised Project Goals: Create a unified vision and shared goals'
            ],
            deliverables: [
              'Unified vision and shared goals for the project',
              'Re-aligned stakeholder responsibilities',
              'Team dynamics optimization',
              'Clear communication channels established'
            ]
          },
          {
            icon: '📋',
            title: 'Recovery Plan Development',
            description: 'Create a detailed recovery plan tailored to the project\'s unique challenges.',
            requirements: [
              'Commitment to redefined project priorities and timelines',
              'Agreement from project leaders on required changes and resources'
            ],
            deliverables: [
              'Customized recovery plan for unique challenges',
              'Resource allocation strategy',
              'Timeline adjustments and milestones',
              'Risk mitigation strategies'
            ]
          },
          {
            icon: '🚀',
            title: 'Implementation & Monitoring',
            description: 'Execute recovery initiatives to restore momentum and ensure smooth project turnaround.',
            requirements: [
              'Dedicated implementation team',
              'Regular progress tracking mechanisms'
            ],
            deliverables: [
              'Recovery initiatives execution',
              'Momentum restoration',
              'Expected business outcomes achievement',
              'Project success assurance'
            ]
          }
        ],
        metrics: [
          { value: '40%', label: 'Faster Delivery', description: 'Average project acceleration achieved through strategic intervention', icon: '⚡' },
          { value: '85%', label: 'Success Rate', description: 'Projects delivered on time and within budget', icon: '🎯' },
          { value: '300%', label: 'ROI Improvement', description: 'Return on investment through strategic project optimization', icon: '📊' },
          { value: '25+', label: 'Projects Delivered', description: 'Strategic initiatives successfully accelerated', icon: '🚀' }
        ]
      },
      
      'scalability-for-growth': {
        title: 'Scaling Technology for Limitless Growth',
        description: 'As your business expands, your technology should be a catalyst for growth. At ElevateIdea, we ensure your systems scale effortlessly to support increasing demand, maximize efficiency, and unlock new opportunities. Our expertise in scalable architecture, performance optimization, and seamless integrations empowers your business to grow without limits—so your technology evolves as fast as your vision.',
        frameworkOverview: 'This framework outlines a structured, step-by-step approach to optimizing your systems for scalability. It covers identifying root causes of scalability issues and system limitations, realigning technology architecture to support future growth, implementing scalable solutions, and ongoing tracking to ensure optimal performance.',
        phases: [
          {
            icon: '🔍',
            title: 'Root Cause Analysis',
            description: 'Identify the root causes of system performance issues and scalability limitations.',
            requirements: [
              'Access to current system architecture documentation',
              'System Architecture Review',
              'Performance Metrics analysis'
            ],
            deliverables: [
              'System documentation and performance data collection',
              'Root cause analysis to identify scalability barriers',
              'Detailed report identifying key scalability issues and areas for improvement'
            ]
          },
          {
            icon: '🎯',
            title: 'Strategic Technology Alignment',
            description: 'Align technology strategy with business growth objectives, ensuring systems can scale efficiently.',
            requirements: [
              'Business Growth Goals: Long-term objectives for scaling technology',
              'Technology Roadmap: Initial goals for aligning system architecture with future needs'
            ],
            deliverables: [
              'Strategy workshops to align business goals with technical capabilities',
              'Scalable technology roadmap to guide system upgrades',
              'Architecture alignment with business objectives'
            ]
          },
          {
            icon: '🚀',
            title: 'Scalable Solution Implementation',
            description: 'Design and implement scalable solutions to address identified challenges and ensure systems are ready for growth.',
            requirements: [
              'Commitment to technology transformation',
              'Resource allocation for implementation'
            ],
            deliverables: [
              'Scalable architecture implementation',
              'Performance optimization solutions',
              'Growth-ready system deployment',
              'Integration capabilities enhancement'
            ]
          },
          {
            icon: '📊',
            title: 'Performance Tracking & Optimization',
            description: 'Ongoing tracking and adjustments to ensure optimal performance and continued scalability.',
            requirements: [
              'Monitoring infrastructure setup',
              'Performance tracking mechanisms'
            ],
            deliverables: [
              'Real-time performance monitoring',
              'Automated scaling policies',
              'Continuous optimization processes',
              'Growth capacity assurance'
            ]
          }
        ],
        metrics: [
          { value: '10x', label: 'Traffic Handling', description: 'Average increase in system capacity after scalability improvements', icon: '📊' },
          { value: '65%', label: 'Cost Reduction', description: 'Operational cost savings through efficient scaling strategies', icon: '💰' },
          { value: '99.9%', label: 'Uptime Achieved', description: 'System reliability and availability after scalability optimization', icon: '🛡️' },
          { value: '50%', label: 'Faster Deployment', description: 'Reduced time-to-market for new features and updates', icon: '🚀' }
        ]
      },
      
      'agile-systems-for-rapid-innovation': {
        title: 'Agile Systems for Unmatched Flexibility & Growth',
        description: 'In today\'s fast-moving world, adaptability is the key to staying ahead. At ElevateIdea, we empower businesses with agile systems that evolve seamlessly with changing market demands. Our expertise in software development optimization and flexible system architecture ensures faster innovation, reduced time-to-market, and a competitive edge—so you can scale, adapt, and lead with confidence.',
        frameworkOverview: 'This framework outlines a structured approach to strategically enhancing and optimizing technology systems across the organization to drive agility and responsiveness. It covers technology assessment, agile methodology deployment, system optimization, and continuous improvement processes.',
        phases: [
          {
            icon: '🔍',
            title: 'Technology Assessment',
            description: 'Evaluate the effectiveness of tools, systems, and processes in relation to business goals.',
            requirements: [
              'Access to current technology documentation (systems architecture, tools, platforms)',
              'Technology stack evaluation',
              'Process efficiency analysis'
            ],
            deliverables: [
              'Comprehensive technology assessment',
              'Tool and system effectiveness evaluation',
              'Agility gaps identification',
              'Optimization recommendations'
            ]
          },
          {
            icon: '⚡',
            title: 'Agile Methodology Deployment',
            description: 'Deploy new tools and processes such as agile methodologies, program management systems, and collaboration platforms.',
            requirements: [
              'Agile methodology training for relevant teams',
              'Commitment to new process adoption',
              'Team collaboration setup'
            ],
            deliverables: [
              'Agile methodology implementation',
              'Program management systems deployment',
              'Enhanced collaboration platforms',
              'Team training and onboarding'
            ]
          },
          {
            icon: '🏗️',
            title: 'System Architecture Optimization',
            description: 'Modernize system architecture to support rapid innovation and flexible development cycles.',
            requirements: [
              'Architecture modernization commitment',
              'Resource allocation for transformation',
              'Technology upgrade planning'
            ],
            deliverables: [
              'Modernized system architecture',
              'Flexible development frameworks',
              'Enhanced customer relationship management systems',
              'Technology transformation implementation'
            ]
          },
          {
            icon: '🚀',
            title: 'Continuous Innovation Enablement',
            description: 'Establish processes for continuous innovation, faster delivery cycles, and market responsiveness.',
            requirements: [
              'Innovation process setup',
              'Performance tracking mechanisms',
              'Market responsiveness planning'
            ],
            deliverables: [
              'Reduced project delays and shortened delivery cycles',
              'Faster market penetration capabilities',
              'Continuous innovation processes',
              'Competitive advantage enhancement'
            ]
          }
        ],
        metrics: [
          { value: '60%', label: 'Faster Time-to-Market', description: 'Reduction in product delivery cycles through agile optimization', icon: '⚡' },
          { value: '80%', label: 'Project Success Rate', description: 'Improved project delivery success through agile methodologies', icon: '🎯' },
          { value: '3x', label: 'Innovation Velocity', description: 'Faster innovation cycles and feature development', icon: '🚀' },
          { value: '90%', label: 'Team Productivity', description: 'Increased team efficiency through optimized processes', icon: '📈' }
        ]
      }
    };

    return contentMap[serviceName] || null;
  } catch (error) {
    console.error('Error loading service content:', error);
    return null;
  }
};

export default { loadServiceContent };