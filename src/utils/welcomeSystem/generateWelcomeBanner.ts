import { createCanvas, loadImage, registerFont } from 'canvas';
import { AttachmentBuilder, GuildMember } from 'discord.js';

registerFont('../../.fonts/Inter Desktop/Inter-Regular.otf', {
  family: 'inter-reg'
});
registerFont('../../.fonts/Inter Desktop/Inter-SemiBold.otf', {
  family: 'inter-semibold'
});

const dim = {
  height: 675,
  width: 1200,
  margin: 50
};

const av = {
  size: 256,
  x: 480,
  y: 170
};

/**
 * Generates a welcome banner for welcoming new members who have joined the guild.
 * @param {GuildMember} member The server member to generate the welcome banner for.
 * @returns {Promise<AttachmentBuilder>} The generated welcome banner image.
 */
export const generateWelcomeBanner = async (
  member: GuildMember
): Promise<AttachmentBuilder> => {
  const { tag } = member.user;
  const { memberCount } = member.guild;

  // Load all required images
  const background = await loadImage('https://i.imgur.com/2VWMBZ0.jpg');
  const avatarUrl = await loadImage(
    member.displayAvatarURL({
      extension: 'png',
      size: 256
    })
  );

  // Create a 1200x675 pixel canvas and get its context
  // The context will be used to modify the canvas
  const canvas = createCanvas(dim.width, dim.height);
  const context = canvas.getContext('2d');

  // Uses the canvas dimensions to stretch background onto entire canvas
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Draws black tinted box on top of background
  context.fillStyle = 'rgba(0,0,0,0.8)';
  context.fillRect(
    dim.margin,
    dim.margin,
    canvas.width - 2 * dim.margin,
    canvas.height - 2 * dim.margin
  );

  // Select the style that will be used to fill the text in
  context.fillStyle = 'white';
  // Specify the text alignment
  context.textAlign = 'center';

  // Fills in 'welcome' text with a solid colour
  context.font = '50px "inter-semibold"';
  context.fillText('welcome', canvas.width / 2, dim.margin + 70);

  // Fills in user tag text with a solid colour
  context.font = '60px "inter-reg"';
  context.fillText(tag, canvas.width / 2, canvas.height - dim.margin - 125);

  // Fills in member count text with a solid colour
  context.font = '40px "inter-semibold"';
  context.fillText(
    `you are the ${memberCount}th member`,
    dim.width / 2,
    dim.height - dim.margin - 50
  );

  // Initialise avatar circle drawing
  context.beginPath();
  // Start the arc to form a circle
  context.arc(
    av.x + av.size / 2,
    av.y + av.size / 2,
    av.size / 2,
    0,
    Math.PI * 2,
    true
  );
  // Complete drawing process
  context.closePath();
  // Clip off drawn on region
  context.clip();

  // Draws avatar onto the main canvas
  context.drawImage(avatarUrl, av.x, av.y);

  const attachment = new AttachmentBuilder(canvas.toBuffer(), {
    name: 'welcome.png'
  });

  return attachment;
};
