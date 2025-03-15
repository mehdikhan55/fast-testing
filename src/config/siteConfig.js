// src/config/siteConfig.js

export const siteConfig = {
    name: 'FAST @ CSI',
    tagline: 'Where Learning FASTs Innovation',
    description: 'An educational initiative designed to Inspire Growth, Nurture Innovation, and Achieve Technical Excellence among students. Much like the uncharted frontier of space, the future is unpredictable, and FAST @ CSI equips students with a solid foundation, robust supports, cutting-edge fuel, expert guidance, and a dynamic vehicle to launch them into their unique journeys.',
    
    // Rocket model settings - ALL positions lowered
    rocketModel: {
      path: '/rocket/scene.glb',
      defaultScale: 0.1,
      defaultPosition: [0, -9, 0],  // Lowered from -4 to -9
      // Settings for different sections/views
      views: {
        'intro': {
          position: [0, -9, 0],  // Lowered from -4 to -9
          rotation: [0, 0, 0],
          scale: 0.1,
          cameraPosition: [0, -2, 15],  // Adjusted camera position
        },
        'foundation': {
          position: [0, -6, 0],  // Lowered from -2 to -7
          rotation: [0, Math.PI * 0.1, 0],
          scale: 0.15,
          cameraPosition: [3, -5, 12],  // Adjusted camera position
          highlight: {
            color: '#00aaff',
            position: [0, -10.5, 0],  // Lowered highlight position
            intensity: 2,
            distance: 4,
          }
        },
        'supports': {
          position: [1, -5, 1],  // Lowered from 0 to -5
          rotation: [0, Math.PI * 0.5, 0],
          scale: 0.15,
          cameraPosition: [5, -3, 10],  // Adjusted camera position
          highlight: {
            color: '#66aaff',
            position: [0, -7, 0],  // Lowered highlight position
            intensity: 1.5,
            distance: 3,
          }
        },
        'fuel': {
          position: [0, -3, 0],  // Lowered from 2 to -3
          rotation: [0, Math.PI * 0.8, 0],
          scale: 0.15,
          cameraPosition: [2, -1, 12],  // Adjusted camera position
          highlight: {
            color: '#aaddff',
            position: [0, -3, 0],  // Lowered highlight position
            intensity: 1.5,
            distance: 3,
          }
        },
        'guidance': {
          position: [2, -2, 0],  // Increased x from 1 to 2 (more right) and y from -1 to -2 (lower)
          rotation: [0, Math.PI * 1.2, 0],
          scale: 0.15,
          cameraPosition: [4, -1, 10],  // Adjusted camera to match new position
          highlight: {
            color: '#ffaa55',
            position: [0, -2, 0],  // Lowered highlight position to match
            intensity: 1.8,
            distance: 3.5,
          }
        },
        'vehicle': {
          position: [0, 0, 0],  // Lowered from 5 to 0
          rotation: [0, Math.PI * 1.8, 0],
          scale: 0.15,
          cameraPosition: [0, 2, 12],  // Adjusted camera position
          highlight: {
            color: '#ff6655',
            position: [0, 0, 0],  // Lowered highlight position
            intensity: 2,
            distance: 4,
          }
        }
      }
    },
    
    // Sections content
    sections: [
      {
        id: 'intro',
        title: 'FAST @ CSI',
        content: 'An educational initiative designed to Inspire Growth, Nurture Innovation, and Achieve Technical Excellence among students. Much like the uncharted frontier of space, the future is unpredictable, and FAST @ CSI equips students with a solid foundation, robust supports, cutting-edge fuel, expert guidance, and a dynamic vehicle to launch them into their unique journeys.',
        icon: 'FaRocket',
        highlight: 'foundation'
      },
      {
        id: 'foundation',
        title: 'The Foundation',
        content: 'Details the Early Years Program, rooted in global research and adapted from Singapore for Pakistani students. This forms the strong base from which our students begin their educational journey towards success and innovation.',
        icon: 'FaCubes',
        highlight: 'supports'
      },
      {
        id: 'supports',
        title: 'The Supports',
        content: 'Highlights the Digital Monitoring Architecture, including digital portfolios and learning stories that track each student\'s progress and achievements. These supports provide the structure needed for consistent growth and development.',
        icon: 'FaColumns',
        highlight: 'fuel'
      },
      {
        id: 'fuel',
        title: 'The Fuel',
        content: 'ELP∞ (Extended Learning Program Infinity) focuses on critical literacies (Digital, AI, Media), 21st-century skills (Critical Thinking, Collaboration), and future skills (Systems Thinking, Design Thinking). This powerful combination propels students forward in their educational journey.',
        icon: 'FaFire',
        highlight: 'guidance'
      },
      {
        id: 'guidance',
        title: 'The Guidance',
        content: 'Describes the rigorously trained teachers and ongoing professional development via the Learning and Development Center. This expert guidance ensures students stay on course and reach their full potential.',
        icon: 'FaCompass',
        highlight: 'vehicle'
      },
      {
        id: 'vehicle',
        title: 'The Vehicle',
        content: 'Outlines CSI\'s Academic Program, featuring project-based learning, skills integration, custom learning spaces, and a strong school-home community. This comprehensive vehicle carries students to their destination, preparing them for whatever challenges the future holds.',
        icon: 'FaSpaceShuttle',
        highlight: 'launch'
      }
    ],
    
    // Animation settings
    animations: {
      sectionTransition: 1.5,
      floatingIntensity: 0.001,
      particleSpeed: 0.05,
      starRotationSpeed: 0.01,
      rocketRotationSpeed: 0.15
    },
    
    // Environment settings
    environment: {
      preset: 'night',
      fogDistance: [15, 30],
      backgroundColor: '#050a1f'
    },
    
    // Contact information
    contact: {
      email: 'contact@fastcsi.edu',
      phone: '',
      address: ''
    }
  };