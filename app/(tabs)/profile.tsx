import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity, ScrollView, Switch, TextInput, Modal, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

import { Text, View } from '@/components/Themed';

// Define types
interface UserProfile {
  name: string;
  age: number;
  location: string;
  bio: string;
  profileImage: string;
  fitnessLevel: string;
  fitnessInterests: string[];
  preferences: {
    ageRange: [number, number];
    maxDistance: number;
    showOnlyFitnessMatches: boolean;
    notificationsEnabled: boolean;
    darkModeEnabled: boolean;
  };
}

// Mock user profile data
const mockUserProfile: UserProfile = {
  name: 'Sample 1',
  age: 30,
  location: 'New York, NY',
  bio: 'Fitness enthusiast who loves running, cycling, and yoga. Looking for workout partners and potential dates who share my passion for an active lifestyle.',
  profileImage: 'https://picsum.photos/id/177/400/400',
  fitnessLevel: 'Intermediate',
  fitnessInterests: ['Running', 'Cycling', 'Yoga', 'HIIT', 'Swimming'],
  preferences: {
    ageRange: [25, 35],
    maxDistance: 25,
    showOnlyFitnessMatches: true,
    notificationsEnabled: true,
    darkModeEnabled: false
  }
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(mockUserProfile);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const toggleFitnessInterest = (interest: string) => {
    if (editedProfile.fitnessInterests.includes(interest)) {
      setEditedProfile({
        ...editedProfile,
        fitnessInterests: editedProfile.fitnessInterests.filter(item => item !== interest)
      });
    } else {
      setEditedProfile({
        ...editedProfile,
        fitnessInterests: [...editedProfile.fitnessInterests, interest]
      });
    }
  };

  const renderProfileView = () => (
    <View style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.nameText}>{profile.name}, {profile.age}</Text>
          <Text style={styles.locationText}>{profile.location}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{profile.fitnessLevel}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <FontAwesome name="edit" size={20} color="#4caf50" />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.bioText}>{profile.bio}</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Fitness Interests</Text>
        <View style={styles.interestsContainer}>
          {profile.fitnessInterests.map((interest, index) => (
            <View key={index} style={styles.interestBadge}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Age Range</Text>
          <Text style={styles.preferenceValue}>
            {profile.preferences.ageRange[0]} - {profile.preferences.ageRange[1]}
          </Text>
        </View>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Maximum Distance</Text>
          <Text style={styles.preferenceValue}>{profile.preferences.maxDistance} miles</Text>
        </View>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Show Only Fitness Matches</Text>
          <Switch
            value={profile.preferences.showOnlyFitnessMatches}
            disabled
          />
        </View>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Notifications</Text>
          <Switch
            value={profile.preferences.notificationsEnabled}
            disabled
          />
        </View>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Dark Mode</Text>
          <Switch
            value={profile.preferences.darkModeEnabled}
            disabled
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEditMode = () => (
    <View style={styles.editContainer}>
      <Text style={styles.editTitle}>Edit Profile</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.input}
          value={editedProfile.name}
          onChangeText={(text) => setEditedProfile({...editedProfile, name: text})}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Age</Text>
        <TextInput
          style={styles.input}
          value={editedProfile.age.toString()}
          onChangeText={(text) => {
            const age = parseInt(text);
            if (!isNaN(age)) {
              setEditedProfile({...editedProfile, age});
            }
          }}
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Location</Text>
        <TextInput
          style={styles.input}
          value={editedProfile.location}
          onChangeText={(text) => setEditedProfile({...editedProfile, location: text})}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={editedProfile.bio}
          onChangeText={(text) => setEditedProfile({...editedProfile, bio: text})}
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Fitness Level</Text>
        <View style={styles.segmentedControl}>
          {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.segmentButton,
                editedProfile.fitnessLevel === level && styles.activeSegment
              ]}
              onPress={() => setEditedProfile({...editedProfile, fitnessLevel: level})}
            >
              <Text style={[
                styles.segmentText,
                editedProfile.fitnessLevel === level && styles.activeSegmentText
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Fitness Interests</Text>
        <View style={styles.interestsEditContainer}>
          {['Running', 'Cycling', 'Yoga', 'HIIT', 'Swimming', 'Weightlifting', 'CrossFit', 'Pilates'].map((interest) => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.interestEditBadge,
                editedProfile.fitnessInterests.includes(interest) && styles.activeInterest
              ]}
              onPress={() => toggleFitnessInterest(interest)}
            >
              <Text style={[
                styles.interestEditText,
                editedProfile.fitnessInterests.includes(interest) && styles.activeInterestText
              ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.editButtons}>
        <TouchableOpacity 
          style={[styles.editActionButton, styles.cancelButton]}
          onPress={handleCancelEdit}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.editActionButton, styles.saveButton]}
          onPress={handleSaveProfile}
        >
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {isEditing ? renderEditMode() : renderProfileView()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: 'white',
    fontWeight: '600',
  },
  editButton: {
    padding: 12,
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333333',
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  interestBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  interestText: {
    color: '#FF4B4B',
    fontWeight: '600',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#333333',
  },
  preferenceValue: {
    fontSize: 16,
    color: '#666666',
  },
  logoutButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#FF4B4B',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  logoutText: {
    color: '#FF4B4B',
    fontSize: 16,
    fontWeight: '600',
  },
  editContainer: {
    padding: 20,
  },
  editTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666666',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeSegment: {
    backgroundColor: '#FF4B4B',
  },
  segmentText: {
    fontSize: 14,
    color: '#666666',
  },
  activeSegmentText: {
    color: 'white',
    fontWeight: '600',
  },
  interestsEditContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  interestEditBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 5,
  },
  activeInterest: {
    backgroundColor: '#FFE5E5',
  },
  interestEditText: {
    color: '#666666',
  },
  activeInterestText: {
    color: '#FF4B4B',
    fontWeight: '600',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  editActionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#FF4B4B',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});